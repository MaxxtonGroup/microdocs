import { Inject, Service } from "typedi";
import { Environment } from "@maxxton/microdocs-core/domain";
import { ProjectTree, ProjectMetadata, Project, ProblemReport } from "@maxxton/microdocs-core/domain";
import { PreProcessor } from "@maxxton/microdocs-core/pre-processor";
import { ProjectService } from "./project.service";
import { DocumentRepository } from "../repositories/document.repo";
import { DocumentCacheHelper } from "../helpers/processor/document-cache.helper";
import { ScriptService } from "./script.service";
import { DependenciesRestHelper } from "../helpers/processor/dependencies-rest.helper";
import { ProcessContext } from "../domain/process-scope.model";
import { DependenciesUsedHelper } from "../helpers/processor/dependencies-used.helper";
import { generateSearchTags } from "../helpers/processor/generate-search-tags.helper";
import { buildTree } from "../helpers/processor/tree.helper";
import { ProcessOptions } from "../domain/process-options.model";
import { reverse } from "dns";

/**
 * Process projects to detect breaking changes
 */
@Service()
export class ProcessService {

  @Inject( "projectRepository" )
  private projectRepository: DocumentRepository;
  @Inject()
  private scriptService: ScriptService;
  @Inject()
  private projectService: ProjectService;
  @Inject()
  private preProcessor: PreProcessor;

  /**
   * Start processing
   * @param options ProcessOptions
   * @return {Promise<ProblemReport>}
   */
  public async process( options: ProcessOptions ): Promise<ProblemReport> {
    let context = await this.initContext( options );
    if(options.document) {
      context.documentCache.addDocument( options.document );
      options.projectTitle = options.document.info.title;
    }

    if ( options.reverseChecking ) {
      if ( !options.document ) {
        throw new Error( "Cannot use 'reverseChecking' without a 'document' defined" )
      } else {
        return this.processDocument( options, context, options.document );
      }
    } else if ( !options.projectTitle ) {
      return this.processAll( options, context );
    } else if ( !options.documentId ) {
      return this.processProject( options, context );
    } else {
      return this.processDocument( options, context );
    }
  }

  /**
   * Initialize scope if it doesn't exists
   * @param options
   * @return {Promise<ProcessContext>}
   */
  private async initContext( options: ProcessOptions ): Promise<ProcessContext> {
    let documentCache = new DocumentCacheHelper( options.env, this.preProcessor, this.scriptService, this.projectService );
    await documentCache.init();

    let context: ProcessContext = {
      strict: options.strict,
      documentCache: documentCache,
      dependenciesRestHelper: new DependenciesRestHelper( documentCache ),
      dependenciesUsedHelper: new DependenciesUsedHelper( documentCache )
    };
    return context;
  }

  /**
   * Process a whole environment
   * @param options
   * @param context
   * @return {Promise<ProblemReport>}
   */
  private async processAll( options: ProcessOptions, context: ProcessContext ): Promise<ProblemReport> {
    let metadatas = await this.projectService.getProjectMetadatas( options.env );

    // Process each project
    let promises       = metadatas.map( metadata => this.processProject( options, context, metadata ) );
    let problemReports = await Promise.all( promises );

    // Merge problem reports
    let report = new ProblemReport();
    problemReports.forEach( nestedReport => report.addAll( nestedReport ) );

    // Build dependency tree
    let tree = buildTree( metadatas, context.documentCache );
    if ( !options.dryRun ) {
      await this.projectRepository.storeTree( options.env, tree );
    }

    return report;
  }

  /**
   * Process a project
   * @param options
   * @param metadata
   * @param context
   * @return {Promise<ProblemReport>}
   */
  private async processProject( options: ProcessOptions, context: ProcessContext, metadata: ProjectMetadata = null ): Promise<ProblemReport> {
    if ( !metadata ) {
      metadata = await this.projectService.getProjectMetadata( options.env, options.projectTitle );
    }

    // List unique document ids by tags
    let documentIds: any = {};
    Object.keys( metadata.tags ).filter( t => !metadata.tags[ t ].opaque ).forEach( t => documentIds[ metadata.tags[ t ].id ] = true );

    // Process each document
    let promises       = Object.keys( documentIds ).map( id => this.processDocument( options, context ) );
    let problemReports = await Promise.all( promises );

    let latestDocument = context.documentCache.getProjectDocument(metadata.title, metadata.latestTag);
    if(latestDocument && latestDocument.tags){
      metadata.searchTags = latestDocument.tags.map(tag => tag.name);
    }

    // Store index
    if ( !options.dryRun ) {
      metadata = await this.projectRepository.storeIndex( options.env, metadata );
    }

    // Merge problem reports
    let report = new ProblemReport();
    problemReports.forEach( nestedReport => report.addAll( nestedReport ) );
    return report;
  }

  /**
   * Process a document of a project
   * @param options
   * @param context
   * @param document
   * @return {Promise<ProblemReport>}
   */
  private async processDocument( options: ProcessOptions, context: ProcessContext, document?: Project ): Promise<ProblemReport> {
    let problemReport = new ProblemReport();

    // Load document
    if(!document) {
      let document = await context.documentCache.loadDocument( problemReport, options.projectTitle, options.documentId );
      if ( !document ) {
        throw new Error( `Unknown document: ${options.env.name}/${options.projectTitle}:${options.documentId}` );
      }
    }

    // Resolve REST dependencies
    await this.resolveRestDependencies( options, context, document, problemReport );

    // Resolve USED dependencies
    await this.resolveUsesDependencies( options, context, document, problemReport );

    if ( options.reverseChecking ) {
      // Load other projects
      let metadatas          = await this.projectService.getProjectMetadatas( options.env );
      let toProcessMetadatas = metadatas.filter( metadata => metadata.title.toLowerCase() !== options.projectTitle.toLowerCase() && metadata.latestTag );

      // Process each other projects against this document
      let promises = toProcessMetadatas.map( async metadata => {
        // Load latest document
        let reverseDocument = await context.documentCache.loadDocument( problemReport, metadata.title, metadata.latestTag );

        // Resolve REST dependencies
        await this.resolveRestDependencies( options, context, reverseDocument, problemReport, document );

        // Resolve USED dependencies
        await this.resolveUsesDependencies( options, context, reverseDocument, problemReport, document );
      } );

    }

    // Generate search tags
    this.generateSearchTags( options, context, document );

    // Store problem report
    document.problems     = problemReport.getProblems();
    document.problemCount = problemReport.getProblems().length;

    // Store document
    if ( !options.dryRun ) {
      document = await this.projectRepository.storeDocument( options.env, options.projectTitle, document );
    }
    context.documentCache.addProjectDocument( document );

    return problemReport;
  }

  /**
   * Resolve REST dependencies
   * @param options
   * @param scope
   * @param document
   * @param problemReport
   * @param scopeDocument
   */
  private async resolveRestDependencies( options: ProcessOptions, scope: ProcessContext, document: Project, problemReport: ProblemReport, scopeDocument?: Project ): Promise<void> {
    let report = await scope.dependenciesRestHelper.resolveRestDependencies( scope.strict, document, scopeDocument );
    problemReport.addAll( report );
  }

  /**
   * Resolve USED dependencies
   * @param options
   * @param scope
   * @param document
   * @param problemReport
   * @param scopeDocument
   */
  private async resolveUsesDependencies( options: ProcessOptions, scope: ProcessContext, document: Project, problemReport: ProblemReport, scopeDocument?: Project ): Promise<void> {
    let report = await scope.dependenciesUsedHelper.resolveUsesDependencies( scope.strict, document, scopeDocument );
    problemReport.addAll( report );
  }

  /**
   * Generate search tags for a document
   * @param options
   * @param scope
   * @param document
   */
  private generateSearchTags( options: ProcessOptions, scope: ProcessContext, document: Project ): void {
    let searchTags = generateSearchTags( document );
    document.tags  = searchTags.map( tagName => <any>{ name: tagName } );
  }
}