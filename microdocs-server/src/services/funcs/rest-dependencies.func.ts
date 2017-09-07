import { Project, DependencyTypes, Dependency, ProblemLevels, ParameterPlacings } from "@maxxton/microdocs-core/domain";
import { ProblemReporter } from "@maxxton/microdocs-core/helpers/problem/problem-reporter.helper";
import { Path } from "@maxxton/microdocs-core/domain/path/path.model";
import { checkPathParameters, checkQueryParameters, checkBodyParameters, checkResponseBody } from "./endpoint-check.func";

/**
 * Resolve Rest dependencies with other projects
 * @param pipe
 * @param project
 * @param scope
 */
export function resolveRestDependencies( project: Project, scope?: Project ) {
  // Don't resolve project if it is   already resolved
  if ( pipe.result.getProject( project.info.title, projecrt.info.version ) != null ) {
    return;
  }

  if ( project.dependencies ) {
    for ( let depTitle in project.dependencies ) {
      if ( (scope && (scope.info.title === depTitle || scope.info.title === project.info.title)) || !scope ) {
        let reverse: boolean       = scope && (scope.info.title === depTitle);
        let dependency: Dependency = project.dependencies[ depTitle ];
        if ( dependency.type === DependencyTypes.REST ) {
          let reporter = new ProblemReporter( project );
          resolveRestClient( pipe, reporter, project, dependency, depTitle, scope, reverse );


          if ( reporter.hasProblems() ) {
            let problems = reverse ? reporter.getRawProblems().map( rawProblem => rawProblem.inverse( project, dependency.component ).problem ) : reporter.getProblems();
            reporter.publish( dependency, project, problems );
            pipe.pipeline.addProblems( problems );
          }
        }
      }
    }
  }
}

function resolveRestClient( pipe: Pipe<any>, reporter: ProblemReporter, project: Project, dependency: Dependency, depTitle: string, scope?: Project, reverse: boolean = false ) {
  // Find the matching version
  let depProject: Project;
  if ( dependency.version ) {
    depProject = pipe.getPrevProject( depTitle, dependency.version );
  }
  if ( !depProject ) {
    depProject = pipe.getPrevProjectVersion( depTitle, dependency.version );
  }

  if ( depProject == null ) {
    reporter.report( ProblemLevels.ERROR, "Unknown project: " + depTitle, dependency.component );
    return;
  }
  console.info("Resolve " + project.info.title + ":" + project.info.version + " against " + depProject.info.title + ":" + depProject.info.version);

  var projectInfo = pipe.projects.filter( info => info.title === depTitle )[ 0 ];
  if ( projectInfo ) {
    dependency.latestVersion = projectInfo.version;
  }
  let compatible = checkDependencyCompatible( depTitle, dependency, depProject, project, reporter, false, reverse, pipe );
  if ( compatible || dependency.version ) {
    dependency.version = depProject.info.version;
  } else {
    let olderDepProject: Project = null;
    do {
      olderDepProject = pipe.getPrevProjectVersion( depTitle, olderDepProject ? olderDepProject.info.version : depProject.info.version );
      if ( olderDepProject ) {
        compatible = checkDependencyCompatible( depTitle, dependency, olderDepProject, project, new ProblemReporter(), true, reverse, pipe );
      }
    } while ( !compatible && olderDepProject != null );
    if ( olderDepProject && olderDepProject.info && olderDepProject.info.version ) {
      dependency.version = olderDepProject.info.version;
    } else {
      dependency.version = depProject.info.version;
    }
    if ( !compatible ) {
      reporter.report( ProblemLevels.ERROR, "Not compatible with: " + depTitle + " (see other problems)", dependency.component );
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
function checkDependencyCompatible( title: string, dependency: Dependency, depProject: Project, currentProject: Project, reporter: ProblemReporter, silence: boolean, reverse: boolean, pipe: Pipe<any> ): boolean {
  let compatible: boolean = true;
  if ( (dependency.deprecatedVersions && dependency.deprecatedVersions.indexOf( depProject.info.version ) != -1) ) {
    if ( reporter ) {
      reporter.report( ProblemLevels.ERROR, "This project is marked as not compatible with version " + depProject.info.version + " (see other problems)", dependency.component );
    }
    compatible = false;
  } else if ( depProject.deprecated ) {
    if ( reporter ) {
      reporter.report( ProblemLevels.ERROR, depProject.info.title + " is marked as deprecated ", dependency.component );
    }
    compatible = false;
  }
  if ( !checkEndpoints( title, dependency, depProject, currentProject, silence, reverse, pipe ) ) {
    compatible = false;
  }
  return compatible;
}

/**
 * Check dependency endpoints are compatible
 * @param title name of the project
 * @param dependency
 * @param dependentProject aka producerProject
 * @param currentProject aka clientProject
 * @param silence Add problems to the client endpoints object
 * @returns {boolean} true if compatible, otherwise false
 */
function checkEndpoints( title: string, dependency: Dependency, dependentProject: Project, currentProject: Project, silence: boolean, reverse: boolean, pipe: Pipe<any> ): boolean {
  var compatible = true;
  if ( dependency.paths != undefined ) {
    for ( var path in dependency.paths ) {
      for ( var method in dependency.paths[ path ] ) {
        var problemReport            = new ProblemReporter( currentProject );
        var clientEndpoint           = dependency.paths[ path ][ method ];
        clientEndpoint.path          = path;
        clientEndpoint.requestMethod = method;
        var producerEndpoint         = findEndpoint( clientEndpoint, path, method, currentProject, dependentProject );
        if ( producerEndpoint != null ) {
          // execute checks on the endpoint
          checkPathParameters(clientEndpoint, producerEndpoint, currentProject, dependentProject, problemReport );
          checkQueryParameters(clientEndpoint, producerEndpoint, currentProject, dependentProject, problemReport );
          checkBodyParameters(clientEndpoint, producerEndpoint, currentProject, dependentProject, problemReport );
          checkResponseBody(clientEndpoint, producerEndpoint, currentProject, dependentProject, problemReport );
        } else {
          // endpoint does not exists
          problemReport.report( ProblemLevels.ERROR, "No mapping for '" + method + " " + path + "' on " + title, clientEndpoint.controller, clientEndpoint.method );
        }

        // log problems
        if ( problemReport.hasProblems() ) {
          compatible = false;
          if ( !silence ) {
            let problems = reverse ? problemReport.getRawProblems().map( rawProblem => rawProblem.inverse( dependentProject, producerEndpoint && producerEndpoint.controller, producerEndpoint && producerEndpoint.method ).problem ) : problemReport.getProblems();
            problemReport.publish( clientEndpoint, currentProject, problems );
            pipe.pipeline.addProblems( problems );
          }
        }
      }
    }
  }
  return compatible;
}

/**
 * Find an endpoint in a given project
 * @param producerProject project to search in
 * @param path path of the endpoint
 * @param method request method of the endpoint
 * @returns {null,Path} returns Path or null if it does not exists
 */
function findEndpoint( clientEndpoint: Path, clientPath: string, clientMethod: string, clientProject:Project, producerProject: Project ): Path {
  let bestMatch: Path = null;
  let errorCount      = 0;
  let warningCount    = 0;
  let variableCount   = 0;
  for ( let producerPath in producerProject.paths ) {
    if ( producerProject.paths[ producerPath ][ clientMethod ] ) {
      // match via wildcards in regexp
      const expression = '^' + producerPath.replace( new RegExp( "\/", 'g' ), '\/' ).replace( new RegExp( "\\{.*?\\}", 'g' ), '([^\/]+)' ) + '$';
      const regExp     = new RegExp( expression );
      const match      = clientPath.match( regExp );

      if ( match && match.length >= 1 ) {
        // build endpoint if match
        const endpoint         = producerProject.paths[ producerPath ][ clientMethod ];
        endpoint.path          = producerPath;
        endpoint.requestMethod = clientMethod;
        let variables          = 0;
        if ( endpoint.parameters ) {
          variables = endpoint.parameters.filter( param => param.in === ParameterPlacings.PATH ).length;
        }

        // check problems
        const report = new ProblemReporter();
        checkPathParameters( clientEndpoint, endpoint, clientProject, producerProject, report );
        let resultErrorCount   = report.getProblems().filter( problem => problem.level === ProblemLevels.ERROR ).length;
        let resultWarningCount = report.getProblems().filter( problem => problem.level === ProblemLevels.WARNING ).length;

        // set as best match if there is no match or it has the fewest problems
        if ( bestMatch == null || variables < variableCount || (variables == variableCount && (resultErrorCount > errorCount || (resultErrorCount == errorCount && resultWarningCount > warningCount))) ) {
          bestMatch     = endpoint;
          errorCount    = resultErrorCount;
          warningCount  = resultWarningCount;
          variableCount = variables;
        }
      }
    }
  }
  return bestMatch;
}