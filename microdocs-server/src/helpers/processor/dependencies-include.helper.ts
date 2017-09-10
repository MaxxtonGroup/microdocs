import { DocumentCacheHelper } from "./document-cache.helper";
import { Project, DependencyTypes, Dependency, Level, ProblemReport} from "@maxxton/microdocs-core/domain";
import { SchemaHelper } from "@maxxton/microdocs-core/helpers";

/**
 * Helps resolving INCLUDE dependencies
 */
export class DependenciesIncludeHelper {

  private documentCacheHelper: DocumentCacheHelper;

  constructor( documentCacheHelper: DocumentCacheHelper ) {
    this.documentCacheHelper = documentCacheHelper;
  }

  /**
   * Resolve INCLUDE dependencies
   * @param project
   * @return {Promise<ProblemReport>}
   */
  public async resolveIncludesDependencies( project: Project ):Promise<ProblemReport> {
    let report = new ProblemReport();
    if ( project.dependencies ) {
      for ( let depTitle in project.dependencies ) {
        let dependency = project.dependencies[ depTitle ];
        if ( dependency.type === DependencyTypes.INCLUDES ) {
          await this.resolveProject( report, project, dependency, depTitle );
        }
      }
    }
    return report;
  }

  /**
   * Combine projects
   * @param report
   * @param project
   * @param dependency
   * @param depTitle
   */
  public async resolveProject( report: ProblemReport, project: Project, dependency: Dependency, depTitle: string ):Promise<void> {
    // Find the matching version
    let depProject: Project;
    if ( dependency.tag ) {
      depProject = await this.documentCacheHelper.loadDocument( report, depTitle, dependency.tag );
    } else {
      depProject = await this.documentCacheHelper.loadDocument( report, depTitle );
    }
    if ( !depProject ) {
      let title = dependency.tag ? depTitle + ":" + dependency.tag : depTitle;
      report.add( {
        level: Level.Error,
        message: `Project ${project.info.title} depends on ${title}, but that project/tag doesn't exists in MicroDocs`,
        hint: `Add ${title} to MicroDocs`,
        sourcePath: `dependencies.${depTitle}`,
        source: project
      } );
      return;
    }
    if ( depProject.deprecated === true ) {
      let title = dependency.tag ? depTitle + ":" + dependency.tag : depTitle;
      report.add( {
        level: Level.Warning,
        message: `Project ${project.info.title} depends on ${title}, but that project/tag is deprecated`,
        hint: `Update the ${depProject.info.title} tag to one that is not deprecated`,
        sourcePath: `dependencies.${depTitle}`,
        source: project,
        target: depProject
      } );
    }
    dependency.tag = depProject.info.tag;

    // Resolve nested includes dependencies first
    let nestedReport = await this.resolveIncludesDependencies( depProject );
    report.addAll(nestedReport);

    // Merge components
    if ( depProject.components ) {
      if ( !project.components ) {
        project.components = {};
      }
      SchemaHelper.merge( project.components, depProject.components );
    }

    // Merge definitions
    if ( depProject.definitions ) {
      if ( !project.definitions ) {
        project.definitions = {};
      }
      SchemaHelper.merge( project.definitions, depProject.definitions );
    }

    // Merge dependencies
    if ( depProject.dependencies ) {
      if ( !project.dependencies ) {
        project.dependencies = {};
      }
      for ( let key in depProject.dependencies ) {
        if ( depProject.dependencies[ key ].type !== DependencyTypes.INCLUDES ) {
          if ( !project.dependencies[ key ] ) {
            project.dependencies[ key ] = <Dependency>{ inherit: true };
          }
          SchemaHelper.merge( project.dependencies[ key ], depProject.dependencies[ key ] );
        }
      }
    }
  }


}