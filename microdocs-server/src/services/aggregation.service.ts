import * as reportRepo from '../repositories/json/report-json.repo';
import * as aggregationRepo from '../repositories/json/aggregation-json.repo';
import {Project} from "../domain/project.model";
import {TreeNode} from "../domain/tree/tree-node.model";
import {Dependency} from "../domain/depenency/dependency.model";
import {DependencyType} from "../domain/depenency/dependency-type.model";
import {Path} from "../domain/path/path.model";
import {ProblemReport} from "../domain/problem/problem-report.model";
import {ProblemLevel} from "../domain/problem/problem-level.model";
import {PathCheck} from "../checks/path-check";
import {RequestParamsCheck} from "../checks/request-params.check";

class AggregationService {

    private endpointChecks:PathCheck[] = [new RequestParamsCheck()];

    public static bootstrap():AggregationService {
        return new AggregationService();
    }

    /**
     * Start the reindex process
     * @return {Project[]}
     */
    public reindex():TreeNode {
        console.info("Start reindex");

        // Find all projects
        var projectCache:{[title:string]:{[version:string]:Project}} = {};
        // var projects:Project[] = [];
        var projectInfos = reportRepo.getProjects();
        projectInfos.forEach(projectInfo => {
            try {
                var project = reportRepo.getProject(projectInfo);
                if (project != null) {
                    if (projectCache[project.info.title] == null || projectCache[project.info.title] == undefined) {
                        projectCache[project.info.title] = {};
                    }
                    projectCache[project.info.title][project.info.version] = project;
                }
            } catch (e) {
                console.error("Failed to load project: " + projectInfo.title);
                console.error(e);
            }
        });

        console.info("Build dependency tree");
        var tree = this.buildDependencyTree(projectCache);

        console.info("Store aggregations");
        for (var title in projectCache) {
            for (var version in projectCache[title]) {
                var project = projectCache[title][version];
                aggregationRepo.storeAggregatedProject(project);
            }
        }
        aggregationRepo.storeAggregatedProjects(tree);

        console.info("Finish reindex");

        return tree;
    }

    /**
     * Build dependency tree
     * @param projects list of all projects
     * @return {TreeNode} result
     */
    public buildDependencyTree(projectCache:{[title:string]:{[version:string]:Project}}):TreeNode {
        // create rootnode
        var rootNode = new TreeNode();

        // add of all projects the latest version
        for (var title in projectCache) {
            for (var version in projectCache[title]) {
                var project = projectCache[title][version];
                var node = new TreeNode();
                node.parent = rootNode;
                node.group = project.info.group;
                node.version = project.info.version;
                node.versions = project.info.versions;
                rootNode.dependencies[project.info.title] = node;
            }
        }

        var copyProjectCache:{[title:string]:{[version:string]:Project}} = {};
        for (var title in projectCache) {
            for (var version in projectCache[title]) {
                if(copyProjectCache[title] == undefined){
                    copyProjectCache[title] = {};
                }
                copyProjectCache[title][version] = projectCache[title][version];
            }
        }

        // resolve dependencies
        for (var title in copyProjectCache) {
            for (var version in copyProjectCache[title]) {
                var project = copyProjectCache[title][version];
                var aggregatedProject = this.resolveDependencies(project, projectCache, rootNode.dependencies[project.info.title]);
                console.info(aggregatedProject);
            }
        }

        return rootNode;
    }

    /**
     * Recursively follow each dependency.
     * Check if a project version is already in the tree
     * @param project project of which the dependencies should be resolved
     * @param projects list of all projects
     * @param parentNode the parent node
     */
    private resolveDependencies(project:Project, projectCache:{[title:string]:{[version:string]:Project}}, parentNode:TreeNode):Project {
        if (project.dependencies != null) {
            for (var title in project.dependencies) {
                var node = new TreeNode();
                node.parent = parentNode;

                //resolve dependency
                var dependency = project.dependencies[title];
                var problemReport:ProblemReport = new ProblemReport("#/dependencies/" + title);
                var problemReports:ProblemReport[] = [problemReport];

                //find dependent project
                var dependentProject:Project = null;
                for (var name in projectCache) {
                    for (var version in projectCache[name]) {
                        var project = projectCache[name][version];
                        if (project.info.title == title) {
                            dependentProject = project;
                        }
                    }
                }
                if (dependentProject != null) {
                    dependency.latestVersion = dependentProject.info.version;
                    dependency.version = dependentProject.info.version;

                    // check endpoint
                    if (dependency.type == "REST") {
                        var endpointProblemReports = this.checkEndpoints(title, dependency, dependentProject);

                        if (endpointProblemReports.length > 0) {
                            //find last compatible if contains problems
                            var previousProject = this.previousProject(dependentProject);
                            while (previousProject != null) {
                                var reports = this.checkEndpoints(title, dependency, previousProject);
                                if (reports.length == 0) {
                                    dependency.version = previousProject.info.version;
                                    break;
                                }
                                previousProject = this.previousProject(previousProject);
                            }
                            if (previousProject != null) {
                                endpointProblemReports.forEach(report => problemReports.push(report));

                                // scan previous project
                                projectCache[previousProject.info.title][previousProject.info.version] = previousProject;
                                this.resolveDependencies(dependentProject, projectCache, node);
                            }
                        }
                    }
                    //todo: check other dependency types
                } else {
                    // project not found
                    problemReport.report(ProblemLevel.ERROR, "Missing project: " + title);
                }
                if (project.problems == undefined || project.problems == null) {
                    project.problems = [];
                }
                for(var i = 0; i < problemReports.length; i++){
                    for(var j = 0; j < problemReports[i].getProblems().length; j++){
                        project.problems.push(problemReports[i].getProblems()[j]);
                    }
                }

                // create node
                var path = parentNode.getRoot().findNodePath(title, dependency.version);
                if (path == null) {
                    node.group = dependentProject.info.group;
                    node.version = dependency.version;
                    node.versions = dependentProject.info.versions;
                    this.resolveDependencies(dependentProject, projectCache, node);
                } else {
                    node.reference = "#" + path;
                }
                parentNode.dependencies[title] = node;
            }
        }
        return project;
    }

    /**
     * Check dependency definition with the real project
     * @param title name of the project
     * @param dependency
     * @param dependentProject
     * @returns {ProblemReport[]} reports of each endpoint
     */
    private checkEndpoints(title:string, dependency:Dependency, dependentProject:Project):ProblemReport[] {
        var problemReports:ProblemReport[] = [];
        if (dependency.paths != undefined) {
            for (var path in dependency.paths) {
                for (var method in dependency.paths[path]) {
                    var problemReport = new ProblemReport("#/dependencies/" + title + "/paths/" + path.replace(new RegExp("/", 'g'), "%2F") + "/" + method);
                    var clientEndpoint = dependency.paths[path][method];
                    var producerEndpoint = this.findEndpoint(dependentProject, path, method);
                    if (producerEndpoint != null) {
                        // execute checks on the endpoint
                        this.endpointChecks.forEach(check => check.check(clientEndpoint, producerEndpoint, problemReport));
                    } else {
                        // endpoint does not exists
                        problemReport.report(ProblemLevel.ERROR, "Missing endpoint: " + method + " " + path);
                    }
                    if (problemReport.getProblems().length > 0) {
                        problemReports.push(problemReport);
                    }
                }
            }
        }
        return problemReports;
    }

    /**
     * Load the previous version of a project
     * @param project
     * @returns {null|Project} previous project or null if it does not exists
     */
    private previousProject(project:Project):Project {
        // load older version if so requested
        var prevProjectInfo = project.info.getPrevVersion();
        if (prevProjectInfo == null) {
            // no previous project
            return null;
        }
        try {
            project = reportRepo.getProject(prevProjectInfo);
            return project;
        } catch (e) {
            console.warn("Failed to load project: " + project.info.title);
            console.warn(e);
            return null;
        }
    }

    /**
     * Find an endpoint in a given project
     * @param project project to search in
     * @param path path of the endpoint
     * @param method request method of the endpoint
     * @returns {null,Path} returns Path or null if it does not exists
     */
    private findEndpoint(project:Project, path:string, method:string):Path {
        if (project.paths != undefined && project.paths[path] != undefined && project.paths[path][method] != undefined) {
            return project.paths[path][method];
        }
        return null;
    }

}

var aggregationService = AggregationService.bootstrap();
export = aggregationService;