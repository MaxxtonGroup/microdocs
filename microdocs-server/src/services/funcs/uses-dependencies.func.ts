import { Project, DependencyTypes, Dependency, ProblemLevels } from "@maxxton/microdocs-core/domain";
import { ProblemReporter } from "@maxxton/microdocs-core/helpers/problem/problem-reporter.helper";

/**
 * Resolve Rest dependencies with other projects
 * @param pipe
 * @param project
 * @param scope
 */
export function resolveUsesDependencies( pipe:Pipe<any>, project:Project, scope?:Project ) {
  if ( project.dependencies ) {
    for ( let depTitle in project.dependencies ) {
      if ( (scope && (scope.info.title === depTitle || scope.info.title === project.info.title)) || !scope ) {
        let dependency:Dependency = project.dependencies[ depTitle ];
        if ( dependency.type === DependencyTypes.USES ) {
          let reporter = new ProblemReporter( project );
          resolveUsesClient( pipe, reporter, project, dependency, depTitle, scope );
          if ( reporter.hasProblems() ) {
            reporter.publish( dependency, project );
            pipe.pipeline.addProblems( reporter.getProblems() );
          }
        }
      }
    }
  }
}

function resolveUsesClient( pipe:Pipe<any>, reporter:ProblemReporter, project:Project, dependency:Dependency, depTitle:string, scope?:Project ) {
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

  var projectInfo = pipe.projects.filter(info => info.title === depTitle)[0];
  if(projectInfo) {
    dependency.latestVersion = projectInfo.version;
  }
  let compatible = checkDependencyCompatible(depTitle, dependency, depProject, project, reporter);
  if(compatible){
    dependency.version = depProject.info.version;
  }else{
    let first = true;
    let olderDepProject:Project = null;
    while(!compatible && (olderDepProject != null || first)){
      first = false;
      olderDepProject = pipe.getPrevProjectVersion(depTitle, olderDepProject ? olderDepProject.info.version : depProject.info.version);
      if(olderDepProject) {
        compatible = checkDependencyCompatible( depTitle, dependency, olderDepProject, project, new ProblemReporter() );
      }
    }
    if(olderDepProject && olderDepProject.info && olderDepProject.info.version){
      dependency.version = olderDepProject.info.version;
    }else{
      dependency.version = depProject.info.version;
    }
    if(!compatible){
      reporter.report( ProblemLevels.ERROR, "Not compatible with: " + depTitle, dependency.component );
    }
  }

  // Resolve nested rest dependencies first
  resolveUsesDependencies( pipe, depProject, scope );
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
  return true;
}
