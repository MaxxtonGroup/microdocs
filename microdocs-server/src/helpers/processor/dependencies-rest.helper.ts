import { DocumentCacheHelper } from "./document-cache.helper";
import { Project, DependencyTypes, Dependency, Path, ParameterPlacings, Level, ProblemReport } from "@maxxton/microdocs-core/domain";
import {
  checkPathParameters,
  checkBodyParameters,
  checkQueryParameters,
  checkResponseBody
} from "./endpoint-check.helper";

/**
 * Helps resolving REST dependencies
 */
export class DependenciesRestHelper {

  private documentCacheHelper: DocumentCacheHelper;
  private doneList: { [title: string]: boolean } = {};

  constructor( documentCacheHelper: DocumentCacheHelper ) {
    this.documentCacheHelper = documentCacheHelper;
  }

  /**
   * Resolve REST dependencies
   * @param strict compatibility checking
   * @param project
   * @param scope
   * @return {Promise<ProblemReport>}
   */
  public async resolveRestDependencies( strict: boolean, project: Project, scope?: string ): Promise<ProblemReport> {
    let problemReport = new ProblemReport();
    // Don't resolve project if it is   already resolved
    if ( this.doneList[ project.info.title + ":" + project.info.tag ] ) {
      return problemReport;
    }
    this.doneList[ project.info.title + ":" + project.info.tag ] = true;

    if ( project.dependencies ) {
      for ( let depTitle in project.dependencies ) {
        if ( (scope && (scope === depTitle || scope === project.info.title)) || !scope ) {
          let reverse: boolean       = scope && (scope === depTitle);
          let dependency: Dependency = project.dependencies[ depTitle ];
          if ( dependency.type === DependencyTypes.REST ) {
            let report = new ProblemReport();
            await this.resolveProject( strict, report, project, dependency, depTitle, scope, reverse );
            if ( reverse ) {
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
   * @param scope
   * @param reverse
   */
  public async resolveProject( strict: boolean, report: ProblemReport, project: Project, dependency: Dependency, depTitle: string, scope: string, reverse: boolean ): Promise<void> {
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
        hint: `Update the version of ${depTitle} to a non deprecated version`,
        sourcePath: `dependencies.${depTitle}`,
        source: project,
        target: depProject
      } );
    }

    let dependencyReport = this.checkDependencyCompatible( depTitle, dependency, depProject, project, strict );
    report.addAll( dependencyReport );
    if ( dependencyReport.isCompatible( strict ) ) {
      dependency.tag = depProject.info.tag;
    } else {
      let olderDepProject: Project = null;
      let olderProblemReport;
      do {
        olderProblemReport = new ProblemReport();
        olderDepProject    = this.documentCacheHelper.loadPreviousDocument( olderProblemReport, depTitle, olderDepProject ? olderDepProject.info.tag : depProject.info.tag );
        if ( olderDepProject ) {
          olderProblemReport = this.checkDependencyCompatible( depTitle, dependency, olderDepProject, project, strict );
        }
      } while ( !olderProblemReport.isCompatible( strict ) && olderDepProject != null );
      if ( olderDepProject && olderDepProject.info && olderDepProject.info.tag ) {
        dependency.tag = olderDepProject.info.tag;
      } else {
        dependency.tag = depProject.info.tag;
      }
    }

    // Resolve nested rest dependencies first
    this.resolveRestDependencies( strict, depProject, scope );
  }

  /**
   * Check if a depended project is compatible
   * @param title name of the project
   * @param dependency
   * @param depProject
   * @param currentProject
   * @param strict
   * @returns {ProblemReport}
   */
  private checkDependencyCompatible( title: string, dependency: Dependency, depProject: Project, currentProject: Project, strict:boolean ): ProblemReport {
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
    } else {
      let nestedReport = this.checkEndpoints( title, dependency, depProject, currentProject, strict );
      problemReport.addAll( nestedReport );
    }
    return problemReport;
  }

  /**
   * Check dependency endpoints are compatible
   * @param title name of the project
   * @param dependency
   * @param dependentProject aka producerProject
   * @param currentProject aka clientProject
   * @param strict
   * @returns {ProblemReport}
   */
  private checkEndpoints( title: string, dependency: Dependency, dependentProject: Project, currentProject: Project, strict: boolean ): ProblemReport {
    let problemReport = new ProblemReport();
    let compatible    = true;
    if ( dependency.paths != undefined ) {
      for ( let path in dependency.paths ) {
        for ( let method in dependency.paths[ path ] ) {
          let clientEndpoint           = dependency.paths[ path ][ method ];
          clientEndpoint.path          = path;
          clientEndpoint.requestMethod = method;
          let producerEndpoint         = this.findEndpoint( clientEndpoint, path, method, currentProject, dependentProject );
          if ( producerEndpoint != null ) {
            // execute checks on the endpoint
            checkPathParameters( clientEndpoint, producerEndpoint, currentProject, dependentProject, problemReport );
            checkQueryParameters( clientEndpoint, producerEndpoint, currentProject, dependentProject, problemReport );
            checkBodyParameters( clientEndpoint, producerEndpoint, currentProject, dependentProject, problemReport, strict );
            checkResponseBody( clientEndpoint, producerEndpoint, currentProject, dependentProject, problemReport, strict );
          } else {
            // endpoint does not exists
            problemReport.add( {
              level: Level.Warning,
              message: `Project ${currentProject.info.title} makes a REST call to the ${dependentProject.info.title} on '${method} ${path}', but there is no Mapping for that endpoint on the ${dependentProject.info.title}`,
              hint: `Check the mapping for '${method} ${path}' on both the ${currentProject.info.title} and ${dependentProject.info.title} project`,
              sourcePath: `dependencies.${dependentProject.info.title}.paths.${path}.${method}`,
              source: currentProject,
              sourceClass: clientEndpoint.controller,
              sourceMethod: clientEndpoint.method,
              target: dependentProject
            } );
          }
        }
      }
    }
    return problemReport;
  }

  /**
   * Find an endpoint in a given project
   * @param producerProject project to search in
   * @param path path of the endpoint
   * @param method request method of the endpoint
   * @returns {null,Path} returns Path or null if it does not exists
   */
  private findEndpoint( clientEndpoint: Path, clientPath: string, clientMethod: string, clientProject: Project, producerProject: Project ): Path {
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
          const report = new ProblemReport();
          checkPathParameters( clientEndpoint, endpoint, clientProject, producerProject, report );
          let resultErrorCount   = report.getProblems().filter( problem => problem.level === Level.Error ).length;
          let resultWarningCount = report.getProblems().filter( problem => problem.level === Level.Warning ).length;

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


}