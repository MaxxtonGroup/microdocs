import { Inject, Service } from "typedi";
import { Environment } from "@maxxton/microdocs-core/domain";
import {
  DependencyNode,
  Project,
  ProjectMetadata,
  ProjectNode,
  ProjectTree,
  ProblemReport
} from "@maxxton/microdocs-core/domain";
import { DocumentRepository } from "../repositories/document.repo";
import { OpPatch, apply as applyPatch } from "json-patch";
import { IndexService } from "./index.service";
import { LoggerFactory } from "@webscale/logging";

const logger = LoggerFactory.create();

/**
 * Service for managing projects and tags
 */
@Service()
export class ProjectService {

  @Inject( "projectRepository" )
  private projectRepository: DocumentRepository;
  @Inject( "reportRepository" )
  private reportRepository: DocumentRepository;
  @Inject()
  private indexService: IndexService;

  /**
   * Get the project tree
   * @param {Environment} env
   * @param {string[]} projectFilter
   * @param {string[]} groupFilter
   * @returns {Promise<ProjectTree>}
   */
  public async getProjectTree( env: Environment, projectFilter: string[], groupFilter: string[] ): Promise<ProjectTree> {
    let projectTree = await this.projectRepository.loadTree( env );
    if ( projectTree ) {
      this.filterTree( projectTree, groupFilter, projectFilter );
    }
    return projectTree;
  }

  /**
   * Check document
   * @param env
   * @param document
   * @return {Promise<ProblemReport>}
   */
  public async checkDocument( env: Environment, document: Project ): Promise<ProblemReport> {
    return this.indexService.startChecking(env, document);
  }

  /**
   * Get list of project metadatas
   * @param {Environment} env
   * @returns {Promise<ProjectMetadata[]>}
   */
  public async getProjectMetadatas( env: Environment ): Promise<ProjectMetadata[]> {
    let metadatas = await this.reportRepository.loadIndexes( env );
    let promises  = metadatas.map( async ( metadata ) => {
      metadata.documents = await this.reportRepository.loadDocuments( env, metadata.title );
      metadata.env       = env.name;
      return metadata;
    } );
    return await Promise.all( promises );
  }

  /**
   * Get project metadata
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<ProjectMetadata>}
   */
  public async getProjectMetadata( env: Environment, title: string ): Promise<ProjectMetadata> {
    let metadata = await this.reportRepository.loadIndex( env, title );
    if ( metadata ) {
      metadata.documents = await this.reportRepository.loadDocuments( env, title );
      metadata.env       = env.name;
    }
    return metadata;
  }

  /**
   * Get project
   * @param {Environment} env
   * @param {string} title
   * @param {string} tag
   * @returns {Promise<Project>}
   */
  public async getProject( env: Environment, title: string, tag?: string ): Promise<Project> {
    let index = await this.getProjectMetadata( env, title );
    if ( !index ) {
      return null;
    }

    let project: Project = null;

    if ( !tag ) {
      if ( !index.latestTag ) {
        return null;
      }
      tag = index.latestTag;
    }
    tag = tag.toLowerCase();

    // Load by id
    project = await this.projectRepository.loadDocument( env, title, tag );

    if ( !project && index.tags[ tag ] ) {
      // Load by tag
      project = await this.projectRepository.loadDocument( env, title, index.tags[ tag ].id );
    }
    if ( !project ) {
      // Load by id from reports store
      project = await this.reportRepository.loadDocument( env, title, tag );
    }
    if ( !project && index.tags[ tag ] ) {
      // Load by tag from report store
      project = await this.reportRepository.loadDocument( env, title, index.tags[ tag ].id );
    }
    if ( !project ) {
      return null;
    }

    project.info.tag = tag;
    return await this.enrichProject( env, project, index );
  }

  /**
   * Get raw project
   * @param {Environment} env
   * @param {string} title
   * @param {string} tag
   * @returns {Promise<Project>}
   */
  public async getRawProject( env: Environment, title: string, tag?: string ): Promise<Project> {
    let index = await this.getProjectMetadata( env, title );
    if ( !index ) {
      return null;
    }

    let project: Project = null;

    if ( !tag ) {
      if ( !index.latestTag ) {
        return null;
      }
      tag = index.latestTag;
    }
    tag = tag.toLowerCase();

    // Load by id
    project = await this.reportRepository.loadDocument( env, title, tag );

    if ( !project && index.tags[ tag ] ) {
      // Load by tag
      project = await this.reportRepository.loadDocument( env, title, index.tags[ tag ].id );
    }
    if ( !project ) {
      return null;
    }

    project.info.tag = tag;
    return await this.enrichProject( env, project, index );
  }

  /**
   * Add project
   * @param {Environment} env
   * @param {Project} report
   * @param {string} title
   * @param {string} tag
   * @returns {Promise<Project>}
   */
  public async addProject( env: Environment, report: Project, title: string, tag?: string ): Promise<Project> {
    if ( !report.info ) {
      report.info = {};
    }
    report.info.publishTime = new Date().toISOString();
    let storedReport        = await this.reportRepository.storeDocument( env, title, report );

    // Update index
    let index = await this.getProjectMetadata( env, title );
    if ( index ) {
      index.group = report.info.group;
      index.color = report.info.color;
      index.title = title;
    } else {
      index = {
        title: title,
        group: report.info.group,
        color: report.info.color
      };
    }
    if ( !index.tags ) {
      index.tags = {};
    }
    if ( tag ) {
      index.tags[ tag.toLowerCase() ] = {
        id: report.id,
        deprecated: report.deprecated,
        updateTime: report.info.publishTime
      }
    }
    index.latestTag = ProjectService.sortTags( index, true )[ 0 ];

    // Store index
    await this.reportRepository.storeIndex( env, index );

    // Start reindex
    this.indexService.startIndexing( env, title, report.id ).then();

    // Return stored project
    if ( tag ) {
      storedReport.info.tag = tag;
    }
    return await this.enrichProject( env, storedReport, index );
  }

  /**
   * Add tag to an existing report
   * @param env
   * @param title
   * @param tag
   * @param newEnv
   * @param newTag
   * @param opaque
   * @return {Promise<Project>}
   */
  public async addTag( env: Environment, title: string, tag: string, newEnv: Environment, newTag: string, opaque: boolean = false ): Promise<Project> {
    tag    = tag.toLowerCase();
    newTag = newTag.toLowerCase();

    // Load index
    let index = await this.getProjectMetadata( newEnv, title );
    if ( !index ) {
      return null;
    }

    // Load matching project
    let project = await this.getProject( env, title, tag );
    if ( !project ) {
      return null;
    }
    if ( !project.info ) {
      project.info = {};
    }
    // Store again if env is different
    if ( env.name.toLowerCase() !== newEnv.name.toLowerCase() ) {
      project = await this.reportRepository.storeDocument( env, title, project );
    }

    // Update index
    index.tags[ newTag ] = {
      id: project.id,
      updateTime: new Date().toISOString(),
      deprecated: project.deprecated,
      opaque: opaque
    };
    index.latestTag      = ProjectService.sortTags( index, true )[ 0 ];

    await this.reportRepository.storeIndex( env, index );
    project.info.tag = newTag;

    // Start reindex
    this.indexService.startIndexing( env, title ).then();

    return await this.enrichProject( env, project, index );
  }

  /**
   * Delete project
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<boolean>}
   */
  public async deleteProject( env: Environment, title: string ): Promise<boolean> {
    let reportIndex  = await this.reportRepository.loadIndex( env, title );
    let projectIndex = await this.projectRepository.loadIndex( env, title );
    if ( !reportIndex && !projectIndex ) {
      return false;
    }
    await this.reportRepository.deleteIndex( env, title );
    await this.projectRepository.deleteIndex( env, title );

    // Start reindex
    this.indexService.startIndexing( env, title ).then();

    return true;
  }

  /**
   * Delete a tag from a project
   * @param env
   * @param title
   * @param tag
   * @return {Promise<boolean>}
   */
  public async deleteTag( env: Environment, title: string, tag?: string ): Promise<boolean> {
    let reportIndex  = await this.reportRepository.loadIndex( env, title );
    let projectIndex = await this.projectRepository.loadIndex( env, title );
    tag              = tag.toLowerCase();

    let edited = false;
    if ( reportIndex && reportIndex.tags && reportIndex.tags[ tag ] ) {
      edited = true;
      delete reportIndex.tags[ tag ];
      reportIndex.latestTag = ProjectService.sortTags( reportIndex, true )[ 0 ];
      await this.reportRepository.storeIndex( env, reportIndex );
    }
    if ( projectIndex && projectIndex.tags && projectIndex.tags[ tag ] ) {
      edited = true;
      delete projectIndex.tags[ tag ];
      projectIndex.latestTag = ProjectService.sortTags( projectIndex, true )[ 0 ];
      await this.projectRepository.storeIndex( env, projectIndex );
    }

    return edited;
  }

  /**
   * Patch all version of a project
   * @param {Environment} env
   * @param {OpPatch[]} patches List of JSON Patch objects (see http://jsonpatch.com/)
   * @param {string} title
   * @returns {Promise<ProjectInfo>}
   */
  public async patchProject( env: Environment, patches: OpPatch[], title: string ): Promise<ProjectMetadata> {
    // Patch all versions
    let index = await this.getProjectMetadata( env, title );
    if ( !index || !index.tags ) {
      return null;
    }
    //todo: patch every document instead of only the one with the tags
    for ( let documentId in index.documents ) {
      await this.patchProjectTag( env, patches, title, documentId, false );
    }

    // Start reindex
    this.indexService.startIndexing( env, title ).then();

    return index;
  }

  /**
   * Patch project version
   * @param {Environment} env
   * @param {OpPatch[]} patches List of JSON Patch objects (see http://jsonpatch.com/)
   * @param {string} title
   * @param {string} tag tag to patch
   * @param reindex
   * @returns {Promise<Project>}
   */
  public async patchProjectTag( env: Environment, patches: OpPatch[], title: string, tag: string, reindex: boolean = true ): Promise<Project> {
    // Patch one version
    let project = await this.getProject( env, title, tag );
    if ( !project ) {
      return null;
    } else {
      let deprecated     = project.deprecated;
      let patchedProject = applyPatch( project, patches );
      await this.reportRepository.storeDocument( env, title, patchedProject );

      if ( deprecated !== patchedProject.deprecated ) {
        // Update index
        let index = await this.reportRepository.loadIndex( env, title );
        let t     = index.tags[ tag ];
        if ( t ) {
          t.deprecated    = patchedProject.deprecated;
          index.latestTag = ProjectService.sortTags( index, true )[ 0 ];
          await this.reportRepository.storeIndex( env, index );
        }
      }

      if ( reindex ) {
        // Start reindex
        this.indexService.startIndexing( env, title, patchedProject.id ).then();
      }

      return patchedProject;
    }
  }

  /**
   * Filter groups and projects out of the tree
   * @param {ProjectTree} root
   * @param {string[]} groups
   * @param {string[]} projects
   * @returns {ProjectTree}
   */
  private filterTree( root: ProjectTree, groups: string[], projects: string[] ): ProjectTree {
    let removeProjects: ProjectNode[] = [];
    if ( root.projects ) {
      root.projects.forEach( project => {
        if ( this.filterNode( project, groups, projects ) ) {
          removeProjects.push( project );
        } else {
          this.filterNodes( project, groups, projects );
        }
      } );
      removeProjects.forEach( project => delete root.projects[ root.projects.indexOf( project ) ] );
    }

    return root;
  }

  /**
   * Filter groups and projects out of nodes from the tree
   * @param {ProjectNode} projectNode
   * @param {string[]} groups
   * @param {string[]} projects
   * @returns {ProjectNode}
   */
  private filterNodes( projectNode: ProjectNode, groups: string[], projects: string[] ): ProjectNode {
    let removeDependency: DependencyNode[] = [];
    projectNode.dependencies.forEach( dependency => {
      if ( this.filterNode( dependency.item, groups, projects ) ) {
        removeDependency.push( dependency );
      } else {
        this.filterNode( dependency.item, groups, projects );
      }
    } );
    removeDependency.forEach( dependency => delete projectNode.dependencies[ projectNode.dependencies.indexOf( dependency ) ] );

    return projectNode;
  }

  /**
   * Filter groups and projects out of a node from the tree
   * @param {ProjectNode} project
   * @param {string[]} groups
   * @param {string[]} projects
   * @returns {boolean}
   */
  private filterNode( project: ProjectNode, groups: string[], projects: string[] ): boolean {
    let filter = false;

    // filter project
    projects.forEach( fTitle => {
      if ( fTitle.indexOf( '!' ) == 0 ) {
        //ignore
        fTitle = fTitle.substring( 1 );
        if ( project.title == fTitle ) {
          filter = true;
        }
      } else {
        //select
        if ( project.title != fTitle ) {
          filter = true;
        }
      }
    } );

    // filter groups
    groups.forEach( group => {
      if ( group.indexOf( '!' ) == 0 ) {
        //ignore
        group = group.substring( 1 );
        if ( project.group == group ) {
          filter = true;
        }
      } else {
        //select
        if ( project.group != group ) {
          filter = true;
        }
      }
    } );
    return filter;
  }

  /**
   * Enrich project info with data from the metadata
   * @param env
   * @param project
   * @param index
   * @return {Project}
   */
  private async enrichProject( env: Environment, project: Project, index: ProjectMetadata ): Promise<Project> {
    if ( !project.info ) {
      project.info = {};
    }
    if ( !index.documents ) {
      index.documents = await this.reportRepository.loadDocuments( env, index.title );
    }

    project.info.title     = index.title;
    project.info.color     = index.color;
    project.info.group     = index.group;
    project.info.tags      = ProjectService.sortTags( index );
    project.info.documents = index.documents;
    return project;
  }

  /**
   * Sort tags from newest to oldest
   * @param index
   * @param filterDeprecated
   * @return sorted tags
   */
  public static sortTags( index: ProjectMetadata, filterDeprecated: boolean = false ): string[] {
    let tags = Object.keys( index.tags ).sort( ( t1, t2 ) => Date.parse( index.tags[ t2 ].updateTime ) - Date.parse( index.tags[ t1 ].updateTime ) );
    if ( filterDeprecated ) {
      tags = tags.filter( t => index.tags[ t ].deprecated !== true );
    }
    return tags;
  }
}
