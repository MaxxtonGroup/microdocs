import { Project, DependencyTypes, Dependency, ProblemLevels } from "@maxxton/microdocs-core/domain";
import { Pipe } from "../pipe";
import { ProblemReporter } from "@maxxton/microdocs-core/helpers/problem/problem-reporter.helper";

/**
 * Resolve Rest dependencies with other projects
 * @param pipe
 * @param project
 * @param scope
 */
export function resolveRestDependencies( pipe:Pipe, project:Project, scope?:Project ) {
  if ( project.dependencies ) {
    for ( let depTitle in project.dependencies ) {
      if ( (scope && (scope.info.title === depTitle || scope.info.title === project.info.title)) || !scope ) {
        let dependency = project.dependencies[ depTitle ];
        if ( dependency.type === DependencyTypes.REST ) {
          let reporter = new ProblemReporter( project );
          resolveRestClient( pipe, reporter, project, dependency, depTitle, scope );
          if ( reporter.hasProblems() ) {
            reporter.publish( dependency, project );
            pipe.pipeline.problems( reporter.getProblems() );
          }
        }
      }
    }
  }
}

function resolveRestClient( pipe:Pipe, reporter:ProblemReporter, project:Project, dependency:Dependency, depTitle:string, scope?:Project ) {
  // Find the matching version
  let version = dependency.latestVersion;
  if ( !version ) {
    let results = pipe.projects.filter( info => info.title === depTitle ).map( info => info.versions );
    if ( results.length == 0 ) {
      reporter.report( ProblemLevels.ERROR, "Unknown project: " + depTitle, dependency.component);
      return;
    }
    version = results[ 0 ][ results[ 0 ].length - 1 ];

    // Load project and resolve rest first before moving on
    let depProject = pipe.getPrevProject(depTitle, version);
    if(depProject == null){
      reporter.report( ProblemLevels.ERROR, "Unknown project: " + depTitle, dependency.component);
      return;
    }



    // Resolve nested rest dependencies first
    resolveRestDependencies(pipe, depProject, scope);
  }

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
function checkDependencyCompatible( title:string, dependency:Dependency, dependentProject:Project, currentProject:Project, silence = false ):boolean {
  if ( dependency.deprecatedVersions && dependency.deprecatedVersions.indexOf( dependentProject.info.version ) != -1 ) {
    return false;
  }
  return this.checkEndpoints( title, dependency, dependentProject, currentProject, silence );
}