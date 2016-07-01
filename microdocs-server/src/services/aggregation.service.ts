import * as projectRepo from '../repositories/json/project-json.repo';
import {ProjectInfo} from "../domain/common/project-info.model";
import {Project} from "../domain/project.model";
import {TreeNode} from "../domain/tree/tree-node.model";

class AggregationService {

    public static bootstrap():AggregationService {
        return new AggregationService();
    }

    /**
     * Start the reindex process
     * @return {Project[]}
     */
    public reindex():Project[] {
        console.info("Start reindex");
        var projects:Project[] = [];
        var projectInfos = projectRepo.getProjects();
        projectInfos.forEach(projectInfo => {
            try {
                var project = projectRepo.getProject(projectInfo);
                if (project != null) {
                    projects.push(project);
                }
            } catch (e) {
                console.error("Failed to load project: " + projectInfo.title);
                console.error(e);
            }
        });


        console.info("Finish reindex");
        return projects;
    }

    /**
     * Build dependency tree
     * @param projects list of all projects
     * @return {TreeNode} result
     */
    public buildDependencyTree(projects:Project[]):TreeNode {
        // create rootnode
        var rootNode = new TreeNode();

        // add of all projects the latest version
        projects.forEach(project => {
            rootNode.children.[project.title] = new TreeNode({
                group: project.info.group,
                version: project.info.version,
                versions: project.info.versions,
                parent: rootNode
            })
        });

        // resolve dependencies
        projects.forEach(project => {
            var children = this.resolveDependencies(project, projects, rootNode);
            rootNode.children[project.info.title].children = children;
        });

        return rootNode;
    }

    /**
     * Recursively follow each dependency.
     * Check if a project version is already in the tree
     * @param project project of which the dependencies should be resolved
     * @param projects list of all projects
     * @param parentNode the parent node
     */
    private resolveDependencies(project:Project, projects:Project[], parentNode:TreeNode) {
        if (project.dependencies != null) {
            for (var key in project.dependencies) {
                var dependentProject = this.resolveDependency(key, null, project.dependencies[key], projects);
                var node = new TreeNode({
                    parent: parentNode,
                    group: dependentProject.info.group,
                    version: dependentProject.info.version,
                    versions: dependentProject.info.versions
                });
                parentNode.children[key] = node;
                var path = parentNode.getRoot().findNodePath(key, dependentProject.info.version);
                if (path == null) {
                    this.resolveDependencies(dependentProject, projects, node);
                } else {
                    node.reference = "#" + path;
                }
            }
        }
    }

    /**
     * Check dependency against the real project.
     * @param title title of the dependent project
     * @param version version of the dependent project
     * @param dependency dependency object of the current project
     * @param projects list of all projects
     * @return {null,Project} the dependent project or null
     */
    private resolveDependency(title:string, version:string, dependency:Dependency, projects:Projects[]):Project {
        //find dependent project
        var dependentProject:Project = null;
        projects.filter(project => project.info.title == title).forEach(project => dependentProject = project);
        if (dependentProject == null) {
            // project not found
            return null;
        }

        // load older version if so requested
        if (version != null && version == dependentProject.info.version) {
            var prevProjectInfo = dependentProject.info.getPrevVersion();
            if (prevProjectInfo == null) {
                // no previous project
                return null;
            }
            try {
                dependentProject = projectRepo.getProject(prevProjectInfo);
                if(dependentProject == null){
                    // project not found
                    return null;
                }
            } catch (e) {
                console.warn("Failed to load project: " + title);
                console.warn(e);
            }
        }

        //check dependency definition with the real project
        //todo
        

        return dependentProject;
    }

}

var aggregationService = AggregationService.bootstrap();
export = aggregationService;