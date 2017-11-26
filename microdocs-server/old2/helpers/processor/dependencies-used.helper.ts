import { DocumentCacheHelper } from "./document-cache.helper";
import { Project, DependencyTypes, Dependency, Level, ProblemReport } from "@maxxton/microdocs-core/domain";

/**
 * Helps resolving USED dependencies
 */
export class DependenciesUsedHelper {

  private documentCacheHelper: DocumentCacheHelper;
  private doneList: { [title: string]: boolean } = {};

  constructor( documentCacheHelper: DocumentCacheHelper ) {
    this.documentCacheHelper = documentCacheHelper;
  }

  /**
   * Resolve USED dependencies
   * @param strict
   * @param project
   * @param scope
   * @return {Promise<ProblemReport>}
   */
  public async resolveUsesDependencies( strict: boolean, project: Project, scopeDocument?: Project ): Promise<ProblemReport> {
    let problemReport = new ProblemReport();
    // Don't resolve project if it is   already resolved
    if ( this.doneList[ project.info.title + ":" + project.info.tag ] ) {
      return problemReport;
    }
    this.doneList[ project.info.title + ":" + project.info.tag ] = true;

    if ( project.dependencies ) {
      for ( let depTitle in project.dependencies ) {
        if((scopeDocument && scopeDocument.info.title.toLowerCase() === depTitle.toLowerCase()) || !scopeDocument){
          let dependency: Dependency = project.dependencies[ depTitle ];
          if ( dependency.type === DependencyTypes.USES ) {
            let report = new ProblemReport();
            await this.resolveProject( strict, report, project, dependency, depTitle, scopeDocument );
            if ( scopeDocument ) {
              report.reverse();
            }
            problemReport.addAll( report );
          }
        }
      }
    }
    return problemReport;
  }

  /**
   * Combine projects
   * @param strict
   * @param report
   * @param project
   * @param dependency
   * @param depTitle
   * @param scopeDocument
   */
  public async resolveProject( strict: boolean, report: ProblemReport, project: Project, dependency: Dependency, depTitle: string, scopeDocument?: Project ): Promise<void> {
    // Find the matching version
    let depProject: Project;
    if(scopeDocument){
      depProject = scopeDocument;
    }else {
      if ( dependency.tag ) {
        depProject = await this.documentCacheHelper.loadDocument( report, depTitle, dependency.tag );
      } else {
        depProject = await this.documentCacheHelper.loadDocument( report, depTitle );
      }
      if ( !depProject ) {
        let title = dependency.tag ? depTitle + ":" + dependency.tag : depTitle;
        report.add( {
          level: Level.Error,
          message: `Project ${project.info.title} uses ${title}, but that project/tag doesn't exists in MicroDocs`,
          hint: `Add ${title} to MicroDocs`,
          sourcePath: `dependencies.${depTitle}`,
          source: project
        } );
        return;
      }
    }
    if ( depProject.deprecated === true ) {
      let title = dependency.tag ? depTitle + ":" + dependency.tag : depTitle;
      report.add( {
        level: Level.Warning,
        message: `Project ${project.info.title} uses ${title}, but that project/tag is deprecated`,
        hint: `Update the version of ${depTitle} to a non deprecated version`,
        sourcePath: `dependencies.${depTitle}`,
        source: project,
        target: depProject
      } );
    }

    let dependencyReport = this.checkDependencyCompatible( depTitle, dependency, depProject, project );
    report.addAll( dependencyReport );
    if(!scopeDocument) {
      if ( dependencyReport.isCompatible( strict ) ) {
        dependency.tag = depProject.info.tag;
      } else {
        let olderDepProject: Project = null;
        let olderProblemReport;
        do {
          olderProblemReport = new ProblemReport();
          olderDepProject    = this.documentCacheHelper.loadPreviousDocument( olderProblemReport, depTitle, olderDepProject ? olderDepProject.info.tag : depProject.info.tag );
          if ( olderDepProject ) {
            olderProblemReport = this.checkDependencyCompatible( depTitle, dependency, olderDepProject, project );
          }
        } while ( !olderProblemReport.isCompatible( strict ) && olderDepProject != null );
        if ( olderDepProject && olderDepProject.info && olderDepProject.info.tag ) {
          dependency.tag = olderDepProject.info.tag;
        } else {
          dependency.tag = depProject.info.tag;
        }
      }
    }

    // Resolve nested rest dependencies first
    this.resolveUsesDependencies( strict, depProject, scopeDocument );
  }

  /**
   * Check if a depended project is compatible
   * @param title name of the project
   * @param dependency
   * @param depProject
   * @param currentProject
   * @returns {ProblemReport}
   */
  private checkDependencyCompatible( title: string, dependency: Dependency, depProject: Project, currentProject: Project ): ProblemReport {
    let problemReport       = new ProblemReport();
    let compatible: boolean = true;
    if ( dependency.deprecatedTags && dependency.deprecatedTags.indexOf( depProject.info.tag ) != -1 ) {
      problemReport.add( {
        level: Level.Warning,
        message: `Project ${title} is marked as not compatible with ${depProject.info.title}:${depProject.info.tag}`,
        hint: `Don't use a fixed tag ('dependencies.${depProject.info.title}.tag') to reference '${depProject.info.title}' or don't mark this version as not compatible ('dependencies.${depProject.info.title}.deprecatedTags') with '${depProject.info.title}:${depProject.info.tag}'`,
        sourcePath: `dependencies.${depProject.info.title}`,
        source: currentProject,
        sourceClass: dependency.component,
        target: depProject
      } );
    } else if ( depProject.deprecated ) {
      problemReport.add( {
        level: Level.Warning,
        message: `Project ${depProject.info.title}:${depProject.info.tag} is marked as deprecated`,
        hint: `Update the ${depProject.info.title} tag to one that is not deprecated`,
        sourcePath: `dependencies.${depProject.info.title}`,
        source: currentProject,
        sourceClass: dependency.component,
        target: depProject
      } );
    }
    return problemReport;
  }


}