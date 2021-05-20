import { BaseResponseHandler } from "./base-response.handler";
import { Project, ProjectInfo, ProjectTree } from "@maxxton/microdocs-core/dist/domain";
import * as express from "express";
import { Config } from "../../config";

export class MicroDocsResponseHandler extends BaseResponseHandler {

  handleProjects( req: express.Request, res: express.Response, projectTree: ProjectTree, env: string ) {
    let filterMethods: Array<string> = [];
    if ( req.query[ 'method' ] ) {
      filterMethods = (req.query[ 'method' ] as string).split( ',' );
    }
    const project = this.mergeProjects( projectTree, filterMethods, env );

    this.response( req, res, 200, project );
  }

  handleProject( req: express.Request, res: express.Response, project: Project, env: string ) {
    if ( req.query[ 'method' ] ) {
      const filterMethods = (req.query[ 'method' ] as string).split( ',' );
      this.filterMethods( project, filterMethods );
    }
    this.response( req, res, 200, project );
  }

  protected mergeProjects( projectTree: ProjectTree, filterMethods: Array<string>, env: string ): Project {
    const combinedProject: Project = this.getGlobalInfo();
    combinedProject.definitions = {};
    combinedProject.paths       = {};

    projectTree.projects.forEach( projectNode => {
      const project = this.injection.ProjectRepository().getAggregatedProject( env, projectNode.title, projectNode.version );
      this.filterMethods( project, filterMethods );

      if ( project.definitions ) {
        for ( const name in project.definitions ) {
          combinedProject.definitions[ name ] = project.definitions[ name ];
        }
      }

      if ( project.paths) {
        for ( const path in project.paths ) {
          if ( !combinedProject.paths[ path ]) {
            combinedProject.paths[ path ] = {};
          }
          for ( const method in project.paths[ path ] ) {
            const endpoint                    = project.paths[ path ][ method ];
            combinedProject.paths[ path ][ method ] = endpoint;
          }
        }
      }
    } );
    return combinedProject;
  }

  protected getGlobalInfo(): Project {
    const project: Project = {};
    project.info        = ({
      title: Config.get( 'application-name' ),
      group: undefined,
      version: Config.get( 'application-version' ).toString(),
      versions: [ Config.get( 'application-version' ).toString() ],
      description: Config.get( 'application-description' )
    } as any);
    project.schemas     = [ Config.get( 'application-schema' ) ];
    project.host        = Config.get( 'application-host' );
    project.basePath    = Config.get( 'application-basePath' );
    return project;
  }

  protected filterMethods( project: Project, requestMethods: Array<string> ) {
    if ( project.paths ) {
      const removePaths: Array<string> = [];
      for ( const path in project.paths ) {
        const removeMethods: Array<string> = [];
        for ( const method in project.paths[ path ] ) {
          for ( let i = 0; i < requestMethods.length; i++ ) {
            const filterMethod = requestMethods[ i ];
            if ( filterMethod.indexOf( '!' ) == 0 ) {
              if ( method.toLowerCase() === filterMethod.substring( 1 ).toLowerCase() ) {
                removeMethods.push( method );
              }
            } else {
              if ( method.toLowerCase() !== filterMethod.toLowerCase() ) {
                removeMethods.push( method );
              }
            }
          }
        }
        removeMethods.forEach( removeMethod => delete project.paths[ path ][ removeMethod ] );
        if ( Object.keys( project.paths[ path ] ).length == 0 ) {
          removePaths.push( path );
        }
      }
      removePaths.forEach( removePath => delete project.paths[ removePath ] );
    }
  }

}
