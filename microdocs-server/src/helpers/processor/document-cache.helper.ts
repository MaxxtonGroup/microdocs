import { Environment } from "@maxxton/microdocs-core/domain";
import { Project, ProblemReport } from "@maxxton/microdocs-core/domain";
import { PreProcessor, Script } from "@maxxton/microdocs-core/pre-processor";
import { ScriptService } from "../../services/script.service";
import { ProjectService } from "../../services/project.service";
import { DependenciesIncludeHelper } from "./dependencies-include.helper";


/**
 * Loads documents and cache them during indexing
 */
export class DocumentCacheHelper {

  private preProcessor: PreProcessor;
  private scriptService: ScriptService;
  private projectService: ProjectService;
  private dependenciesIncludeHelper: DependenciesIncludeHelper;

  private env: Environment;
  private scripts: Script[];
  private reportCache: { [projectName: string]: { [documentId: string]: Project | Promise<Project> } } = {};
  private projectCache: { [projectName: string]: { [documentId: string]: Project | Promise<Project> } } = {};

  constructor( env: Environment, preProcessor: PreProcessor, scriptService: ScriptService, projectService: ProjectService ) {
    this.env                       = env;
    this.preProcessor              = preProcessor;
    this.scriptService             = scriptService;
    this.projectService            = projectService;
    this.dependenciesIncludeHelper = new DependenciesIncludeHelper( this );
  }

  public async init(): Promise<void> {
    if ( !this.scripts ) {
      this.scripts = await this.scriptService.getScripts( this.env );
    }
  }

  /**
   * Cache project document
   * @param project
   */
  public addProjectDocument( project: Project ): void {
    if ( !this.projectCache[ project.info.title ] ) {
      this.projectCache[ project.info.title ] = {};
    }
    this.projectCache[ project.info.title ][project.id] = project;
  }

  /**
   * Get project document from cache
   * @param title
   * @param id
   * @return {any}
   */
  public getProjectDocument(title:string, id:string): Project {
    if(this.projectCache[title] && this.projectCache[title][id]){
      return this.projectCache[title][id];
    }
    return null;
  }

  /**
   * Cache document
   * @param document
   */
  public async addDocument( document: Project ): Promise<void> {
    // Preprocess it
    this.preProcessDocument( document );

    // Resolve INCLUDES dependencies
    await this.mergeIncludeDependencies( document );

    // Add to cache
    if ( !this.reportCache[ document.info.title ] ) {
      this.reportCache[ document.info.title ] = {};
    }
    this.reportCache[ document.info.title ][document.id] = document;
  }

  /**
   * Load document and preprocess it, caching enabled
   * @param problemReport
   * @param title
   * @param documentId
   * @return {Promise<Project>}
   */
  public loadDocument( problemReport: ProblemReport, title: string, documentId?: string ): Promise<Project> {
    if ( !this.reportCache[ title ] ) {
      this.reportCache[ title ] = {};
    }
    let documentIdAlias = documentId || "~~~latest";
    let item            = this.reportCache[ title ][ documentIdAlias ];
    if ( !item ) {
      // Load document and preprocess it
      let promise                                                   = new Promise<Project>( ( resolve, reject ) => {
        try {
          // Load document
          this.projectService.getRawProject( this.env, title, documentId ).then( async (document) => {
            try {
              if ( document ) {
                // Preprocess it
                this.preProcessDocument( document );

                // Resolve INCLUDES dependencies
                let problemReport = await this.mergeIncludeDependencies( document );
                //todo: do something with the problemReport
              }

              // Return and set cache item for the next one
              this.reportCache[ title ][ documentIdAlias ] = document;
              resolve( document );
            } catch ( e ) {
              reject( e );
            }
          } ).catch( reject );
        } catch ( e ) {
          reject( e );
        }
      } );
      this.reportCache[ title ][ documentIdAlias ] = promise;
      return promise;
    } else {
      // Return cached item
      return Promise.resolve( item );
    }
  }

  /**
   * Get the previous document
   * @param problemReport
   * @param title
   * @param currentTag
   * @return {Promise<Project>}
   */
  public async loadPreviousDocument( problemReport: ProblemReport, title: string, currentTag: string ): Promise<Project> {
    let metadata     = await this.projectService.getProjectMetadata( this.env, title );
    let tags         = ProjectService.sortTags( metadata, true );
    let currentIndex = tags.indexOf( currentTag );
    currentIndex++;
    if ( currentIndex >= tags.length ) {
      return null;
    } else {
      return this.loadDocument( problemReport, title, tags[ currentIndex ] );
    }
  }

  private preProcessDocument( document: Project ) {
    this.scripts.filter( script => this.preProcessor.shouldApply( script, document, this.env.name ) ).forEach( script => {
      this.preProcessor.processScript( script, document, this.env.name )
    } );
  }

  private mergeIncludeDependencies( document: Project ):Promise<ProblemReport> {
    return this.dependenciesIncludeHelper.resolveIncludesDependencies( document );
  }
}
