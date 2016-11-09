import { ReportRepository } from '../repositories/report.repo';
import { ProjectSettingsRepository } from "../repositories/project-settings.repo";
import {
    Project,
    Node,
    ProjectNode,
    ProjectTree,
    DependencyNode,
    Dependency,
    Path,
    Problem,
    ProjectInfo,
    ProblemLevels,
    DependencyTypes
} from "@maxxton/microdocs-core/domain";

import { ProblemReporter, SchemaHelper } from "@maxxton/microdocs-core/helpers";
import { MicroDocsPreProcessor } from "@maxxton/microdocs-core/pre-processor";
import * as helpers from "@maxxton/microdocs-core/helpers";

import { PathCheck } from "../checks/path-check";
import { QueryParamsCheck } from "../checks/query-params.check";
import { BodyParamsCheck } from "../checks/body-params.check";
import { PathParamsCheck } from "../checks/path-params.check";
import { ResponseCheck } from "../checks/response.check";
import { ProjectService } from "./project.service";


export class AggregationService {

  private pathParamsCheck:PathCheck  = new PathParamsCheck();
  private endpointChecks:PathCheck[] = [ new QueryParamsCheck(), new BodyParamsCheck(), this.pathParamsCheck, new ResponseCheck() ];

  constructor( private projectService:ProjectService, private reportRepo:ReportRepository, private projectSettingsRepo:ProjectSettingsRepository ) {
  }

  /**
   * Check new project for breaking changes
   * @param project
   * @returns {Problem[]}
   */
  public checkProject( env:string, project:Project ):Problem[] {
    // Fix project
    this.fixDependencyUpperCase( project );

    // Load all projects
    var projectCache = this.loadProjects( env );

    // check dependencies
    var projectTree = new ProjectTree();
    this.resolveDependencies( env, project, projectCache, projectTree );

    // check other projects for breaking changes
    var clientProblems = this.reverseCheckDependencies( env, project, projectCache, projectTree );

    // collect problems
    var problems = helpers.getProblemsInProject( project );
    clientProblems.forEach( problem => problems.push( problem ) );

    return problems;
  }

  /**
   * Start the reindex process
   * @return {ProjectTree}
   */
  public reindex( env:string ):ProjectTree {
    console.info( "Start reindex" );

    // Load all projects
    var projectCache = this.loadProjects( env );

    console.info( "Build dependency tree" );
    var tree = this.buildDependencyTree( env, projectCache );

    console.info( "Store aggregations" );
    for ( var title in projectCache ) {
      for ( var version in projectCache[ title ] ) {
        var project = projectCache[ title ][ version ];
        this.projectService.storeAggregatedProject( env, project );
      }
    }
    this.projectService.storeAggregatedProjects( env, tree );

    console.info( "Finish reindex" );

    return tree;
  }

  /**
   * Build dependency tree
   * @param projects list of all projects
   * @return {ProjectTree} result
   */
  public buildDependencyTree( env:string, projectCache:{[title:string]:{[version:string]:Project}} ):ProjectTree {
    // create rootnode
    var projectTree = new ProjectTree();

    // add of all projects the latest version
    for ( var title in projectCache ) {
      for ( var version in projectCache[ title ] ) {
        var project          = projectCache[ title ][ version ];
        var projectNode      = new ProjectNode( title );
        projectNode.parent   = projectTree;
        projectNode.group    = project.info.group;
        projectNode.version  = project.info.version;
        projectNode.versions = project.info.versions;
        projectNode.tags     = this.buildTags( project );
        projectTree.addProject( projectNode );
      }
    }

    var copyProjectCache:{[title:string]:{[version:string]:Project}} = {};
    for ( var title in projectCache ) {
      for ( var version in projectCache[ title ] ) {
        if ( copyProjectCache[ title ] == undefined ) {
          copyProjectCache[ title ] = {};
        }
        copyProjectCache[ title ][ version ] = projectCache[ title ][ version ];
      }
    }

    // resolve dependencies
    for ( var title in copyProjectCache ) {
      for ( var version in copyProjectCache[ title ] ) {
        var project           = copyProjectCache[ title ][ version ];
        var aggregatedProject = this.resolveDependencies( env, project, projectCache, projectTree.projects.filter( projectNode => projectNode.title === project.info.title )[ 0 ] );
      }
    }

    return projectTree;
  }

  /**
   * Fix uppercase dependency names
   * @param project
   */
  private fixDependencyUpperCase( project:Project ) {
    if ( project.dependencies ) {
      var fixedDependencies = {};
      for ( var name in project.dependencies ) {
        fixedDependencies[ name.toLowerCase() ] = project.dependencies[ name ];
      }
      project.dependencies = fixedDependencies;
    }
  }

  /**
   * Load all projects
   * @return all project structured as [name].[version].[project]
   */
  private loadProjects( env:string ):{[title:string]:{[version:string]:Project}} {
    var projectCache:{[title:string]:{[version:string]:Project}} = {};
    // var projects:Project[] = [];
    var projectInfos                                             = this.reportRepo.getProjects( env );
    projectInfos.forEach( projectInfo => {
      try {
        var project = this.reportRepo.getProject( env, projectInfo );
        if ( project != null ) {
          this.fixDependencyUpperCase( project );
          project = this.applyProjectSettings( project, env );
          if ( projectCache[ project.info.title ] == null || projectCache[ project.info.title ] == undefined ) {
            projectCache[ project.info.title ] = {};
          }
          projectCache[ project.info.title ][ project.info.version ] = project;
        }
      } catch ( e ) {
        console.error( "Failed to load project: " + projectInfo.title );
        console.error( e );
      }
    } );
    return projectCache;
  }

  /**
   *
   * @param project
   * @param projectCache
   * @param parentNode
   */
  private reverseCheckDependencies( env:string, project:Project, projectCache:{[title:string]:{[version:string]:Project}}, parentNode:Node ):Problem[] {
    var problems:Problem[] = [];
    if ( !projectCache[ project.info.title ] ) {
      projectCache[ project.info.title ] = {};
    }
    projectCache[ project.info.title ][ project.info.version ] = project;
    for ( var title in projectCache ) {
      var versions = Object.keys( projectCache[ title ] ).sort();
      if ( versions.length > 0 ) {
        var latestVersion = versions[ versions.length - 1 ];
        var clientProject = projectCache[ title ][ latestVersion ];
        if ( clientProject.dependencies != null && clientProject.definitions != undefined ) {
          if ( clientProject.dependencies[ project.info.title ] != undefined ) {
            var dependency = clientProject.dependencies[ project.info.title ];
            this.resolveDependency( env, clientProject, project.info.title, dependency, projectCache, parentNode );

            // map problems to the produces endpoints
            var problemReport = new ProblemReporter( project );
            if ( dependency.paths != undefined && dependency.paths != null ) {
              for ( var path in dependency.paths ) {
                for ( var method in dependency.paths[ path ] ) {
                  var endpoint = dependency.paths[ path ][ method ];
                  if ( endpoint.problems != undefined && endpoint.problems != null ) {
                    var producerEndpoint = SchemaHelper.resolveReference( 'paths.' + path + "." + method, project );
                    endpoint.problems.forEach( problem => {
                      problemReport.report(
                          problem.level,
                          problem.message,
                          producerEndpoint ? producerEndpoint.controller : undefined,
                          producerEndpoint ? producerEndpoint.method : undefined,
                          clientProject,
                          title,
                          latestVersion,
                          endpoint ? endpoint.controller : undefined,
                          endpoint ? endpoint.method : undefined );
                    } );
                  }
                }
              }
            }

            problemReport.getProblems().forEach( problem => problems.push( problem ) );
          }
        }
      }
    }
    return problems;
  }

  /**
   * Resolve all dependencies
   * @param project
   * @param projectCache
   * @param parentNode
   * @returns {Project}
   */
  private resolveDependencies( env:string, project:Project, projectCache:{[title:string]:{[version:string]:Project}}, parentNode:Node ):Project {
    if ( project.dependencies != null && project.dependencies != undefined ) {
      var dependencies = {};
      for ( var title in project.dependencies ) {
        dependencies[ title ] = project.dependencies[ title ];
      }
      for ( var title in dependencies ) {
        var dependency = dependencies[ title ];
        this.resolveDependency( env, project, title, dependency, projectCache, parentNode );
      }
    }
    return project;
  }

  /**
   * Recursively follow each dependency.
   * Check if a project version is already in the tree
   * @param project project of which the dependencies should be resolved
   * @param projects list of all projects
   * @param parentNode the parent node
   */
  private resolveDependency( env:string, project:Project, title:string, dependency:Dependency, projectCache:{[title:string]:{[version:string]:Project}}, parentNode:Node ) {
    var projectNode    = new ProjectNode( title );
    projectNode.parent = parentNode;

    //resolve dependency
    var dependencyProblems:ProblemReporter = new ProblemReporter( project );

    //find dependent project
    var dependentProject:Project = null;
    for ( var name in projectCache ) {
      for ( var version in projectCache[ name ] ) {
        if ( projectCache[ name ][ version ].info.title.toLowerCase() == title.toLowerCase() ) {
          dependentProject = projectCache[ name ][ version ];
        }
      }
    }
    if ( dependentProject != null ) {
      dependency.latestVersion = dependentProject.info.version;
      dependency.version       = dependentProject.info.version;
      dependency.group         = dependentProject.info.group;

      // check endpoint
      if ( dependency.type == DependencyTypes.REST ) {
        var compatible = this.checkDependencyCompatible( title, dependency, dependentProject, project );

        if ( !compatible ) {
          //find last compatible if contains problems
          var previousProject = this.previousProject( env, dependentProject );
          while ( previousProject != null ) {
            var prevCompatible = this.checkDependencyCompatible( title, dependency, previousProject, project, true );

            if ( prevCompatible ) {
              dependency.version = previousProject.info.version;
              break;
            }
            previousProject = this.previousProject( env, previousProject );
          }
          if ( previousProject != null ) {
            // scan previous project
            projectCache[ previousProject.info.title ][ previousProject.info.version ] = previousProject;
            this.resolveDependencies( env, dependentProject, projectCache, projectNode );
          }
        }
      }
      //todo: check other dependency types
    } else {
      // project not found
      dependencyProblems.report( ProblemLevels.ERROR, "Unknown project: " + title, dependency.component );
    }
    if ( dependencyProblems.hasProblems() ) {
      // log problems
      dependencyProblems.publish( dependency, project );
    }

    // create node
    var path = parentNode.getRoot().findNodePath( title, dependency.version );
    if ( path == null ) {
      if ( dependency != null ) {
        projectNode.version = dependency.version;
      }
      if ( dependentProject != null ) {
        projectNode.group    = dependentProject.info.group;
        projectNode.versions = dependentProject.info.versions;
        this.resolveDependencies( env, dependentProject, projectCache, projectNode );
      }
    } else {
      projectNode.reference = "#" + path;
    }
    projectNode.tags = this.buildTags( project );
    if ( parentNode instanceof ProjectTree ) {
      (<ProjectTree>parentNode).addProject( projectNode );
    } else {
      var parentProjectNode = <ProjectNode> parentNode;
      var dependencyNode    = new DependencyNode( projectNode, dependency.type, project.problemCount );
      parentProjectNode.problems += project.problemCount;
      parentProjectNode.addDependency( dependencyNode );
    }

  }

  private buildTags( project:Project ):string[] {
    var tags = {};
    if ( project.paths ) {
      for ( var path in project.paths ) {
        var segments = path.split( '/' );
        segments.forEach( segment => {
          var trimSegment = segment.trim();
          if ( trimSegment && trimSegment.length > 0 && (trimSegment.indexOf( '{' ) != 0 || trimSegment.indexOf( '}' ) != trimSegment.length - 1) ) {
            tags[ trimSegment ] = null;
          }
        } );
      }
    }
    if ( project.definitions ) {
      for ( var name in project.definitions ) {
        var definition = project.definitions[ name ];
        if ( definition.name && definition.name.trim().length > 0 ) {
          tags[ definition.name.trim() ] = null;
        }
      }
    }
    return Object.keys( tags );
  }

  /**
   * Check if a depended project is compatible
   * @param title name of the project
   * @param dependency
   * @param dependentProject
   * @param currentProject
   * @param silence Add problems to the client endpoints object
   * @returns {boolean} true if compatible, otherwise false
   */
  private checkDependencyCompatible( title:string, dependency:Dependency, dependentProject:Project, currentProject:Project, silence = false ):boolean {
    if ( dependency.deprecatedVersions && dependency.deprecatedVersions.indexOf( dependentProject.info.version ) != -1 ) {
      return false;
    }
    return this.checkEndpoints( title, dependency, dependentProject, currentProject, silence );
  }

  /**
   * Check dependency endpoints are compatible
   * @param title name of the project
   * @param dependency
   * @param dependentProject
   * @param currentProject
   * @param silence Add problems to the client endpoints object
   * @returns {boolean} true if compatible, otherwise false
   */
  private checkEndpoints( title:string, dependency:Dependency, dependentProject:Project, currentProject:Project, silence = false ):boolean {
    var compatible = true;
    if ( dependency.paths != undefined ) {
      for ( var path in dependency.paths ) {
        for ( var method in dependency.paths[ path ] ) {
          var problemReport            = new ProblemReporter( currentProject );
          var clientEndpoint           = dependency.paths[ path ][ method ];
          clientEndpoint.path          = path;
          clientEndpoint.requestMethod = method;
          var producerEndpoint         = this.findEndpoint( clientEndpoint, path, method, dependentProject );
          if ( producerEndpoint != null ) {
            // execute checks on the endpoint
            this.endpointChecks.forEach( check => check.check( clientEndpoint, producerEndpoint, currentProject, problemReport ) );
          } else {
            // endpoint does not exists
            problemReport.report( ProblemLevels.ERROR, "No mapping for '" + method + " " + path + "' on " + title, clientEndpoint.controller, clientEndpoint.method );
          }

          // log problems
          if ( problemReport.hasProblems() ) {
            compatible = false;
            if ( !silence ) {
              problemReport.publish( clientEndpoint, currentProject );
            }
          }
        }
      }
    }
    return compatible;
  }

  /**
   * Load the previous version of a project
   * @param project
   * @returns {null|Project} previous project or null if it does not exists
   */
  private previousProject( env:string, project:Project ):Project {
    // load older version if so requested
    var prevProjectInfo:ProjectInfo = null;

    var sortedVersions = project.info.versions.sort();
    var index          = sortedVersions.indexOf( project.info.version );
    index--;
    if ( index >= 0 && sortedVersions[ index ] != undefined ) {
      var version = sortedVersions[ index ];
      if ( project.info.versions.filter( v => v == version ).length == 0 ) {
        return null;
      }
      prevProjectInfo = new ProjectInfo( project.info.title, project.info.group, version, project.info.versions );
    }

    if ( prevProjectInfo == null ) {
      // no previous project
      return null;
    }
    try {
      project = this.reportRepo.getProject( env, prevProjectInfo );
      project = this.applyProjectSettings( project, env );
      return project;
    } catch ( e ) {
      console.warn( "Failed to load project: " + project.info.title );
      console.warn( e );
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
  private findEndpoint( clientEndpoint:Path, clientPath:string, clientMethod:string, project:Project ):Path {
    var bestMatch = null;
    var errorCount = 0;
    var warningCount = 0;
    for ( var producerPath in project.paths ) {
      if ( project.paths[ producerPath ][ clientMethod ] ) {
        // match via wildcards in regexp
        var expression = '^' + producerPath.replace( new RegExp( "\/", 'g' ), '\/' ).replace( new RegExp( "\\{.*?\\}", 'g' ), '(.+)' ) + '$';
        var regExp     = new RegExp( expression );
        var match      = clientPath.match( regExp );

        if ( match && match.length >= 1 ) {
          // build endpoint if match
          var endpoint           = project.paths[ producerPath ][ clientMethod ];
          endpoint.path          = producerPath;
          endpoint.requestMethod = clientMethod;

          // check problems
          var report = new ProblemReporter();
          this.pathParamsCheck.check( clientEndpoint, endpoint, project, report );
          let resultErrorCount = report.getProblems().filter(problem => problem.level === ProblemLevels.ERROR).length;
          let resultWarningCount = report.getProblems().filter(problem => problem.level === ProblemLevels.WARNING).length;

          // set as best match if there is no match or it has the fewest problems
          if(bestMatch == null || resultErrorCount > errorCount || (resultErrorCount == errorCount && resultWarningCount > warningCount)){
            var bestMatch = endpoint;
            errorCount = resultErrorCount;
            warningCount = resultWarningCount;
          }
        }
      }
    }
    return bestMatch;
  }

  private isSegmentVariable( segment:string ):boolean {
    return segment.indexOf( "{" ) == 0 && segment.lastIndexOf( "}" ) == segment.length - 1;
  }

  /**
   * Apply project settings
   * @param project
   * @returns {Project}
   */
  private applyProjectSettings( project:Project, env:string ):Project {
    var settings   = this.projectSettingsRepo.getSettings();
    var newProject = new MicroDocsPreProcessor().processProject( settings, project, env );
    return newProject;
  }
}