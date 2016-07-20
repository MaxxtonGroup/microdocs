import {ReportJsonRepository} from '../repositories/json/report-json.repo';
import {ProjectSettingsJsonRepository} from "../../dist/repositories/json/project-settings-json.repo";
import {ReportRepository} from '../repositories/report.repo';
import {ProjectSettingsRepository} from "../repositories/project-settings.repo";
import {
  Project,
  TreeNode,
  Dependency,
  DependencyType,
  Path,
  ProblemReport,
  ProblemLevel
} from "microdocs-core-ts/dist/domain";

import {PathCheck} from "../checks/path-check";
import {QueryParamsCheck} from "../checks/query-params.check";
import {BodyParamsCheck} from "../checks/body-params.check";
import {PathParamsCheck} from "../checks/path-params.check";
import {ResponseCheck} from "../checks/response.check";
import {ProjectService} from "./project.service";

export class AggregationService {

  private endpointChecks:PathCheck[] = [new QueryParamsCheck(), new BodyParamsCheck(), new PathParamsCheck(), new ResponseCheck()];
  private reportRepo:ReportRepository;
  private projectSettingsRepo:ProjectSettingsRepository;
  private projectService:ProjectService;

  constructor() {
    this.reportRepo = ReportJsonRepository.bootstrap();
    this.projectSettingsRepo = ProjectSettingsJsonRepository.bootstrap();
    this.projectService = ProjectService.bootstrap();
  }

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
    var projectInfos = this.reportRepo.getProjects();
    projectInfos.forEach(projectInfo => {
      try {
        var project = this.reportRepo.getProject(projectInfo);
        if (project != null) {
          project = this.mergeProjectSettings(project);
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
        this.projectService.storeAggregatedProject(project);
      }
    }
    this.projectService.storeAggregatedProjects(tree);

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
        if (copyProjectCache[title] == undefined) {
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
    if (project.dependencies != null && project.dependencies != undefined) {
      var dependencies = {};
      for (var title in project.dependencies) {
        dependencies[title] = project.dependencies[title];
      }
      var problemCount:number = 0;
      for (var title in dependencies) {
        var node = new TreeNode();
        node.parent = parentNode;

        //resolve dependency
        var dependency = dependencies[title];
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
          dependency.group = dependentProject.info.group;

          // check endpoint
          if (dependency.type == "REST") {
            var endpointProblemReports = this.checkEndpoints(title, dependency, dependentProject, project);

            if (endpointProblemReports.length > 0) {
              //find last compatible if contains problems
              var previousProject = this.previousProject(dependentProject);
              while (previousProject != null) {
                var reports = this.checkEndpoints(title, dependency, previousProject, project);
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
        for (var i = 0; i < problemReports.length; i++) {
          for (var j = 0; j < problemReports[i].getProblems().length; j++) {
            project.problems.push(problemReports[i].getProblems()[j]);
          }
        }

        // create node
        var path = parentNode.getRoot().findNodePath(title, dependency.version);
        if (path == null) {
          if (dependency != null) {
            node.version = dependency.version;
          }
          if (dependentProject != null) {
            node.group = dependentProject.info.group;
            node.versions = dependentProject.info.versions;
            this.resolveDependencies(dependentProject, projectCache, node);
          }
        } else {
          node.reference = "#" + path;
        }
        parentNode.dependencies[title] = node;
        if (project.problems != undefined) {
          if (parentNode.problems == undefined) {
            parentNode.problems == project.problems.length;
          } else {
            parentNode.problems += project.problems.length;
          }
        }
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
  private checkEndpoints(title:string, dependency:Dependency, dependentProject:Project, currentProject:Project):ProblemReport[] {
    var problemReports:ProblemReport[] = [];
    if (dependency.paths != undefined) {
      for (var path in dependency.paths) {
        for (var method in dependency.paths[path]) {
          var problemReport = new ProblemReport("#/dependencies/" + title + "/paths/" + path.replace(new RegExp("/", 'g'), "%2F") + "/" + method);
          var clientEndpoint = dependency.paths[path][method];
          clientEndpoint.path = path;
          clientEndpoint.requestMethod = method;
          var producerEndpoint = this.findEndpoint(dependentProject, path, method, problemReport);
          if (producerEndpoint != null) {
            // execute checks on the endpoint
            this.endpointChecks.forEach(check => check.check(clientEndpoint, producerEndpoint, currentProject, problemReport));
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
      project = this.reportRepo.getProject(prevProjectInfo);
      project = this.mergeProjectSettings(project);
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
  private findEndpoint(project:Project, clientPath:string, clientMethod:string, problemReport:ProblemReport):Path {
    var clientSegments:string[] = clientPath.split('/');
    for (var producerPath in project.paths) {
      var producerSegments:string[] = producerPath.split('/');
      if (clientSegments.length == producerSegments.length) {
        var almostEquals = true;
        var equals = true;
        for (var i = 0; i < clientSegments.length; i++) {
          var clientSegment:string = clientSegments[i];
          var producerSegment:string = producerSegments[i];

          if (!this.isSegmentVariable(producerSegment) && !this.isSegmentVariable(clientSegment) && clientSegment != producerSegment) {
            // segment is not equals
            equals = false;
            almostEquals = false;
            break;
          } else if (this.isSegmentVariable(producerSegment) != this.isSegmentVariable(clientSegment)) {
            // segment on the producer or client is a variable. Hard to check
            equals = false;
            almostEquals = true;
          }else{
            // segments are both on the producer and client variable
          }
        }
        if (almostEquals || equals) {
          for (var method in project.paths[producerPath]) {
            if (method.toLowerCase() == clientMethod.toLowerCase()) {
              if (!equals) {
                problemReport.report(ProblemLevel.WARNING, "Path variable(s) do not match");
              }
              var endpoint = project.paths[producerPath][method];
              endpoint.path = producerPath;
              endpoint.requestMethod = method;
              return endpoint;
            }
          }
        }
      }
    }
    return null;
  }

  private isSegmentVariable(segment:string):boolean {
    return segment.indexOf("{") == 0 && segment.lastIndexOf("}") == segment.length - 1;
  }

  /**
   * Merge project settings over the project object
   * @param project
   * @returns {Project}
   */
  private mergeProjectSettings(project:Project):Project {
    var settings = this.projectSettingsRepo.getSettings();
    if(settings['global'] != undefined && settings['global'] != null){
      project = <Project> this.mergeObjects(project, settings['global']);
    }

    if (project.info != undefined && project.info != null) {
      if (project.info.group != undefined && project.info.group != null) {
        if (settings['groups'] != undefined && settings['groups'] != null &&
            settings['groups'][project.info.group] != undefined && settings['groups'][project.info.group] != null) {
          project = <Project> this.mergeObjects(project,settings['groups'][project.info.group]);
        }
      }

      if (project.info.title != undefined && project.info.title != null) {
        if (settings['projects'] != undefined && settings['projects'] != null &&
          settings['projects'][project.info.title] != undefined && settings['projects'][project.info.title] != null) {
          project = <Project> this.mergeObjects(project,settings['projects'][project.info.title]);
        }
      }
    }

    return project;
  }

  /**
   * Merge obj2 on top of obj1
   * @param obj1
   * @param obj2
   * @returns {{}} return merged object
   */
  private mergeObjects(obj1:{}, obj2:{}):{} {
    for(var key in obj2){
      if(obj1[key] != undefined && typeof(obj1[key]) == 'object'){
        obj1[key] = this.mergeObjects(obj1[key], obj2[key]);
      }else{
        obj1[key] = obj2[key];
      }
    }
    return obj1;
  }

}