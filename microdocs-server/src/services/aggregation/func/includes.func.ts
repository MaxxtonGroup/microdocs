import { DependencyTypes, Dependency } from "@maxxton/microdocs-core/domain";
import { Pipe } from "../pipe";
import { Project, ProblemLevels} from "@maxxton/microdocs-core/domain";
import { ProblemReporter } from "@maxxton/microdocs-core/helpers";
import { SchemaHelper } from "@maxxton/microdocs-core/helpers/schema/schema.helper";

/**
 * Combine project with includes dependency
 * @param pipe
 * @param project
 */
export function combineIncludes( pipe:Pipe, project:Project ):void {
  if ( project.dependencies ) {
    for ( var depTitle in project.dependencies ) {
      var dependency = project.dependencies[ depTitle ];
      if ( dependency.type === DependencyTypes.INCLUDES ) {
        let reporter = new ProblemReporter(project);
        includeProject( pipe, reporter, project, dependency, depTitle );
        if(reporter.hasProblems()){
          reporter.publish(dependency, project);
          pipe.pipeline.problems(reporter.getProblems());
        }
      }
    }
  }
}

/**
 * Combine projects
 * @param pipe
 * @param reporter
 * @param dependency
 * @param depTitle
 */
function includeProject( pipe:Pipe, reporter:ProblemReporter, project:Project, dependency:Dependency, depTitle:string ) {
  // Find the matching version
  let version = dependency.version;
  if ( !version ) {
    let results = pipe.projects.filter( info => info.title === depTitle ).map( info => info.versions );
    if ( results.length == 0 ) {
      reporter.report( ProblemLevels.ERROR, "Unknown project: " + depTitle, dependency.component);
      return;
    }
    version = results[ 0 ][ results[ 0 ].length - 1 ];
  }

  // Load project and resolve includes first before moving on
  let depProject = pipe.getPrevProject(depTitle, version);
  if(depProject == null){
    reporter.report( ProblemLevels.ERROR, "Unknown project: " + depTitle, dependency.component);
    return;
  }
  // Resolve nested includes dependencies first
  combineIncludes(pipe, depProject);

  // Merge components
  if(depProject.components){
    if(!project.components){
      project.components = {};
    }
    SchemaHelper.merge(project.components, depProject.components);
  }

  // Merge definitions
  if(depProject.definitions){
    if(!project.definitions){
      project.definitions = {};
    }
    SchemaHelper.merge(project.definitions, depProject.definitions);
  }

  // Merge dependencies
  if(depProject.dependencies){
    for(let key in depProject.dependencies){
      if(depProject.dependencies[key].type !== DependencyTypes.INCLUDES){
        if(!project.dependencies[key]){
          project.definitions[key] = <Dependency>{inherit: true};
        }
        SchemaHelper.merge( project.definitions[key], depProject.definitions[key]);
      }
    }
  }


}