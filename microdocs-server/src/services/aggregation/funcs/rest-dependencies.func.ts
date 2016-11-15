///<reference path="../../../checks/query-params.check.ts"/>
import { Project, DependencyTypes, Dependency, ProblemLevels } from "@maxxton/microdocs-core/domain";
import { Pipe } from "../pipe";
import { ProblemReporter } from "@maxxton/microdocs-core/helpers/problem/problem-reporter.helper";
import { Path } from "@maxxton/microdocs-core/domain/path/path.model";
import { PathCheck } from "../../../checks/path-check";
import { PathParamsCheck } from "../../../checks/path-params.check";
import { QueryParamsCheck } from "../../../checks/query-params.check";
import { BodyParamsCheck } from "../../../checks/body-params.check";
import { ResponseCheck } from "../../../checks/response.check";

const pathParamsCheck:PathCheck  = new PathParamsCheck();
const endpointChecks:PathCheck[] = [ new QueryParamsCheck(), new BodyParamsCheck(), this.pathParamsCheck, new ResponseCheck() ];

/**
 * Resolve Rest dependencies with other projects
 * @param pipe
 * @param project
 * @param scope
 */
export function resolveRestDependencies( pipe:Pipe<any>, project:Project, scope?:Project ) {
  if ( project.dependencies ) {
    for ( let depTitle in project.dependencies ) {
      if ( (scope && (scope.info.title === depTitle || scope.info.title === project.info.title)) || !scope ) {
        let dependency:Dependency = project.dependencies[ depTitle ];
        if ( dependency.type === DependencyTypes.REST ) {
          let reporter = new ProblemReporter( project );
          resolveRestClient( pipe, reporter, project, dependency, depTitle, scope );
          if ( reporter.hasProblems() ) {
            reporter.publish( dependency, project );
            pipe.pipeline.addProblems( reporter.getProblems() );
          }
        }
      }
    }
  }
}

function resolveRestClient( pipe:Pipe<any>, reporter:ProblemReporter, project:Project, dependency:Dependency, depTitle:string, scope?:Project ) {
  // Find the matching version
  let depProject:Project;
  if ( dependency.version ) {
    depProject = pipe.getPrevProject( depTitle, dependency.version );
  }
  if ( !depProject || depProject.deprecated === true ) {
    depProject = pipe.getPrevProjectVersion( depTitle, dependency.version );
  }

  if ( depProject == null ) {
    reporter.report( ProblemLevels.ERROR, "Unknown project: " + depTitle, dependency.component );
    return;
  }

  let compatible = checkDependencyCompatible(depTitle, dependency, depProject, project, reporter);
  if(compatible){
    dependency.version = depProject.info.version;
  }else{
    let olderDepProject = pipe.getPrevProjectVersion(depTitle, depProject.info.version);
    while(!compatible && olderDepProject != null){
      compatible = checkDependencyCompatible(depTitle, dependency, olderDepProject, project, new ProblemReporter());
      olderDepProject = pipe.getPrevProjectVersion(depTitle, depProject.info.version);
    }
    if(compatible){
      dependency.version = depProject.info.version;
    }else{
      reporter.report( ProblemLevels.ERROR, "Not compatible with: " + depTitle, dependency.component );
    }
  }

  // Resolve nested rest dependencies first
  resolveRestDependencies( pipe, depProject, scope );
}

/**
 * Check if a depended project is compatible
 * @param title name of the project
 * @param dependency
 * @param depProject
 * @param currentProject
 * @param reporter
 * @returns {boolean} true if compatible, otherwise false
 */
function checkDependencyCompatible( title:string, dependency:Dependency, depProject:Project, currentProject:Project, reporter?:ProblemReporter ):boolean {
  if ( dependency.deprecatedVersions && dependency.deprecatedVersions.indexOf( depProject.info.version ) != -1 ) {
    if(reporter) {
      reporter.report( ProblemLevels.WARNING, "This project is marked as not compatible with version " + depProject.info.version, dependency.component );
    }
    return false;
  }
  return checkEndpoints( title, dependency, depProject, currentProject, reporter != undefined );
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
function checkEndpoints( title:string, dependency:Dependency, dependentProject:Project, currentProject:Project, silence = false ):boolean {
  var compatible = true;
  if ( dependency.paths != undefined ) {
    for ( var path in dependency.paths ) {
      for ( var method in dependency.paths[ path ] ) {
        var problemReport            = new ProblemReporter( currentProject );
        var clientEndpoint           = dependency.paths[ path ][ method ];
        clientEndpoint.path          = path;
        clientEndpoint.requestMethod = method;
        var producerEndpoint         = findEndpoint( clientEndpoint, path, method, dependentProject );
        if ( producerEndpoint != null ) {
          // execute checks on the endpoint
          endpointChecks.forEach( check => check.check( clientEndpoint, producerEndpoint, currentProject, problemReport ) );
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
 * Find an endpoint in a given project
 * @param project project to search in
 * @param path path of the endpoint
 * @param method request method of the endpoint
 * @returns {null,Path} returns Path or null if it does not exists
 */
function findEndpoint( clientEndpoint:Path, clientPath:string, clientMethod:string, project:Project ):Path {
  var bestMatch:Path = null;
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
        pathParamsCheck.check( clientEndpoint, endpoint, project, report );
        let resultErrorCount = report.getProblems().filter(problem => problem.level === ProblemLevels.ERROR).length;
        let resultWarningCount = report.getProblems().filter(problem => problem.level === ProblemLevels.WARNING).length;

        // set as best match if there is no match or it has the fewest problems
        if(bestMatch == null || resultErrorCount > errorCount || (resultErrorCount == errorCount && resultWarningCount > warningCount)){
          bestMatch = endpoint;
          errorCount = resultErrorCount;
          warningCount = resultWarningCount;
        }
      }
    }
  }
  return bestMatch;
}