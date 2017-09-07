import { Inject, Service } from "typedi";
import { Environment } from "../domain/environment.model";
import { ProjectTree, ProjectMetadata, Project } from "@maxxton/microdocs-core/domain";
import { ProjectService } from "./project.service";
import { DocumentRepository } from "../repositories/document.repo";
import { ProblemReport } from "../domain/problem-report.model";

/**
 * Process projects to detect breaking changes
 */
@Service()
export class ProcessService {

  @Inject( "projectRepository" )
  private projectRepository: DocumentRepository;
  @Inject( "reportRepository" )
  private reportRepository: DocumentRepository;

  private cache: { [envName: string]: { [projectName: string]: { [documentId: string]: Project | Promise<Project> } } };

  public async processAll( env: Environment ): Promise<ProjectTree> {
    let metadatas = await this.reportRepository.loadIndexes( env );

    let results = await metadatas.map( metadata => this.processProject( env, metadata ) );
    return null;
  }

  public async processProject( env: Environment, metadata: ProjectMetadata ): Promise<ProjectMetadata> {
    let documentIds = await this.reportRepository.loadDocuments( env, metadata.title );

    let problemReports = await documentIds.map( documentId => this.processReport( env, metadata.title, documentId ) );
    problemReports.map(problemReport => this.applyProblemReport(problemReport));
    return null;
  }

  public async processReport( env: Environment, title: string, documentId: string ): Promise<ProblemReport> {
    // Load document
    let document = await this.reportRepository.loadDocument( env, title, documentId );
    let problemReport:ProblemReport = new ProblemReport();

    // Resolve REST dependencies
    this.resolveRestDependencies(document, problemReport);

    // Resolve USED dependencies
    this.resolveUsesDependencies(document, problemReport);

    // Generate search tags
    this.generateSearchTags(document);

    return problemReport;
  }

  /**
   * Load document and preprocess it, caching enabled
   * @param env
   * @param title
   * @param documentId
   * @return {Promise<Project>}
   */
  private loadDocument( env: Environment, title: string, documentId: string ): Promise<Project> {
    if ( !this.cache[ env.name ] ) {
      this.cache[ env.name ] = {};
    }
    if ( !this.cache[ env.name ][ title ] ) {
      this.cache[ env.name ][ title ] = {};
    }
    let item = this.cache[ env.name ][ title ][ documentId ];
    if ( !item ) {
      // Load document and preprocess it
      let promise = new Promise<Project>((resolve, reject) => {
        try{
          // Load document
          this.reportRepository.loadDocument(env, title, documentId).then(document => {
            try {

              // Preprocess it
              this.preProcessDocument( document );

              // Resolve INCLUDES dependencies
              this.mergeIncludeDependencies(document);

              // Return and set cache item for the next one
              this.cache[ env.name ][ title ][ documentId ] = document;
              resolve( document );
            }catch(e){
              reject(e);
            }
          }).catch(reject);
        }catch(e){
          reject(e);
        }
      });
      this.cache[ env.name ][ title ][ documentId ] = promise;
      return promise;
    } else {
      // Return cached item
      return Promise.resolve( item );
    }
  }

  /**
   * Preprocess document
   * @param document
   * @return {Project}
   */
  private preProcessDocument( document: Project ): void {
    //todo: implement preprocessor
  }

  /**
   * Merge INCLUDED dependencies with the current document
   * @param document
   */
  private mergeIncludeDependencies( document: Project ):void {
    //todo: implement mergeIncludeDependencies
  }

  /**
   * Resolve REST dependencies
   * @param document
   * @param problemReport
   */
  private resolveRestDependencies( document: Project, problemReport: ProblemReport ):void {
    //todo: implement mergeIncludeDependencies
  }

  /**
   * Resolve USED dependencies
   * @param document
   * @param problemReport
   */
  private resolveUsesDependencies( document: Project, problemReport: ProblemReport ):void {
    //todo: implement resolveUsesDependencies
  }

  /**
   * Generate search tags for a document
   * @param document
   */
  private generateSearchTags( document: Project ):void {
    //todo: implement generateSearchTags
  }
}