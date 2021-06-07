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
export function combineIncludes( pipe: Pipe<any>, project: Project ): void {
  if ( project.dependencies ) {
    for ( const depTitle in project.dependencies ) {
      const dependency = project.dependencies[ depTitle ];
      if ( dependency.type === DependencyTypes.INCLUDES ) {
        const reporter = new ProblemReporter(project);
        includeProject( pipe, reporter, project, dependency, depTitle );
        if (reporter.hasProblems()) {
          reporter.publish(dependency, project);
          pipe.pipeline.addProblems(reporter.getProblems());
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
function includeProject( pipe: Pipe<any>, reporter: ProblemReporter, project: Project, dependency: Dependency, depTitle: string ) {
  // Find the matching version
  let depProject: Project;
  if (dependency.version) {
    depProject = pipe.getPrevProject(depTitle, dependency.version);
  }
  if ( !depProject || depProject.deprecated === true ) {
    depProject = pipe.getPrevProjectVersion(depTitle, dependency.version);
  }

  if (depProject == null) {
    reporter.report( ProblemLevels.ERROR, "Unknown project: " + depTitle, dependency.component);
    return;
  }
  dependency.version = depProject.info.version;

  // Resolve nested includes dependencies first
  combineIncludes(pipe, depProject);

  // Merge components
  if (depProject.components) {
    if (!project.components) {
      project.components = {};
    }
    SchemaHelper.merge(project.components, depProject.components);
  }

  // Merge definitions
  if (depProject.definitions) {
    if (!project.definitions) {
      project.definitions = {};
    }
    SchemaHelper.merge(project.definitions, depProject.definitions);
  }

  // Merge dependencies
  if (depProject.dependencies) {
    if (!project.dependencies) {
      project.dependencies = {};
    }
    for (const key in depProject.dependencies) {
      if (depProject.dependencies[key].type !== DependencyTypes.INCLUDES) {
        if (!project.dependencies[key]) {
          project.dependencies[key] = ({inherit: true} as Dependency);
        }
        SchemaHelper.merge( project.dependencies[key], depProject.dependencies[key]);
      }
    }
  }


}
