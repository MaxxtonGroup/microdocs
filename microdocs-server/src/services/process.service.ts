import { Inject, Service } from "typedi";
import { Environment } from "../domain/environment.model";
import { ProjectTree, ProjectMetadata, Project, ProblemReport } from "@maxxton/microdocs-core/domain";
import { PreProcessor } from "@maxxton/microdocs-core/pre-processor";
import { ProjectService } from "./project.service";
import { DocumentRepository } from "../repositories/document.repo";
import { DocumentCacheHelper } from "../helpers/processor/document-cache.helper";
import { ScriptService } from "./script.service";
import { DependenciesRestHelper } from "../helpers/processor/dependencies-rest.helper";
import { ProcessScope } from "../domain/process-scope.model";
import { DependenciesUsedHelper } from "../helpers/processor/dependencies-used.helper";
import { generateSearchTags } from "../helpers/processor/generate-search-tags.helper";
import { buildTree } from "../helpers/processor/tree.helper";

/**
 * Process projects to detect breaking changes
 */
@Service()
export class ProcessService {

  @Inject( "projectRepository" )
  private projectRepository: DocumentRepository;
  @Inject()
  private scriptService:ScriptService;
  @Inject()
  private projectService:ProjectService;
  @Inject()
  private preProcessor:PreProcessor;

  /**
   * Initialize scope if it doesn't exists
   * @param env
   * @param strict
   * @param scope
   * @return {Promise<ProcessScope>}
   */
  private async init(env: Environment, strict:boolean, scope:ProcessScope):Promise<ProcessScope>{
    // Initialize process scope if it doesn't exists
    if(!scope){
      scope = {};
    }
    scope.strict = strict;
    if(!scope.documentCache){
      scope.documentCache = new DocumentCacheHelper(env, this.preProcessor, this.scriptService, this.projectService);
      await scope.documentCache.init();
    }
    if(!scope.dependenciesRestHelper){
      scope.dependenciesRestHelper = new DependenciesRestHelper(scope.documentCache);
    }
    if(!scope.dependenciesUsedHelper){
      scope.dependenciesUsedHelper = new DependenciesUsedHelper(scope.documentCache);
    }
    return scope;
  }

  /**
   * Process a whole environment
   * @param env
   * @param strict
   * @param scope
   * @return {Promise<ProblemReport>}
   */
  public async processAll( env: Environment, strict:boolean = true, scope:ProcessScope = null ): Promise<ProblemReport> {
    scope = await this.init(env, strict, scope);
    let metadatas = await this.projectService.getProjectMetadatas( env );

    // Process each project
    let promises = metadatas.map( metadata => this.processProject( env, metadata, strict, scope ) );
    let problemReports = await Promise.all(promises);

    // Merge problem reports
    let report = new ProblemReport();
    problemReports.forEach(nestedReport => report.addAll(nestedReport));

    // Build dependency tree
    let tree = buildTree(metadatas,  scope.documentCache);
    await this.projectRepository.storeTree(env, tree);

    return report;
  }

  /**
   * Process a project
   * @param env
   * @param metadata
   * @param strict
   * @param scope
   * @return {Promise<ProblemReport>}
   */
  public async processProject( env: Environment, metadata: ProjectMetadata, strict:boolean = true, scope:ProcessScope = null ): Promise<ProblemReport> {
    scope = await this.init(env, strict, scope);

    // List unique document ids by tags
    let documentIds:any = {};
    Object.keys(metadata.tags).filter(t => !metadata.tags[t].opaque).forEach(t => documentIds[metadata.tags[t].id] = true);

    // Process each document
    let promises = Object.keys(documentIds).map(id => this.processDocument(env, metadata.title, id, strict, scope));
    let problemReports = await Promise.all(promises);

    // Store index
    metadata = await this.projectRepository.storeIndex(env, metadata);

    // Merge problem reports
    let report = new ProblemReport();
    problemReports.forEach(nestedReport => report.addAll(nestedReport));
    return report;
  }

  /**
   * Process a document of a project
   * @param env
   * @param title
   * @param documentId
   * @param strict
   * @param scope
   * @return {Promise<ProblemReport>}
   */
  public async processDocument( env: Environment, title: string, documentId: string, strict:boolean = true, scope:ProcessScope = null ): Promise<ProblemReport> {
    scope = await this.init(env, strict, scope);
    let problemReport = new ProblemReport();

    // Load document
    let document = await scope.documentCache.loadDocument( problemReport, title, documentId );

    // Resolve REST dependencies
    await this.resolveRestDependencies(scope, document, problemReport);

    // Resolve USED dependencies
    await this.resolveUsesDependencies(scope, document, problemReport);

    // Generate search tags
    this.generateSearchTags(scope, document);

    // Store problem report
    document.problems = problemReport.getProblems();
    document.problemCount = problemReport.getProblems().length;

    // Store document
    document = await this.projectRepository.storeDocument(env, title, document);
    scope.documentCache.addProjectDocument(document);

    return problemReport;
  }

  /**
   * Resolve REST dependencies
   * @param scope
   * @param document
   * @param problemReport
   */
  private async resolveRestDependencies( scope:ProcessScope, document: Project, problemReport: ProblemReport ):Promise<void> {
    let report = await scope.dependenciesRestHelper.resolveRestDependencies(scope.strict, document);
    problemReport.addAll(report);
  }

  /**
   * Resolve USED dependencies
   * @param scope
   * @param document
   * @param problemReport
   */
  private async resolveUsesDependencies( scope:ProcessScope, document: Project, problemReport: ProblemReport ):Promise<void> {
    let report = await scope.dependenciesUsedHelper.resolveUsesDependencies(scope.strict, document);
    problemReport.addAll(report);
  }

  /**
   * Generate search tags for a document
   * @param scope
   * @param document
   */
  private generateSearchTags( scope:ProcessScope, document: Project ):void {
    let searchTags = generateSearchTags(document);
    document.tags = searchTags.map(tagName => <any>{name:tagName});
  }
}