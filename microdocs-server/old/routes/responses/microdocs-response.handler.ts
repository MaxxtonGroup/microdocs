import { BaseResponseHandler } from "./base-response.handler";
import { Project, ProjectInfo, ProjectTree } from "@maxxton/microdocs-core/domain";
import * as express from "express";
import { Config } from "../../config";

export class MicroDocsResponseHandler extends BaseResponseHandler {

  handleProjects( req:express.Request, res:express.Response, projectTree:ProjectTree, env:string ) {
    var filterMethods:string[] = [];
    if ( req.query[ 'method' ] ) {
      filterMethods = req.query[ 'method' ].split( ',' );
    }
    var project = this.mergeProjects( projectTree, filterMethods, env );

    this.response( req, res, 200, project );
  }

  handleProject( req:express.Request, res:express.Response, project:Project, env:string ) {
    if ( req.query[ 'method' ] ) {
      var filterMethods = req.query[ 'method' ].split( ',' );
      this.filterMethods( project, filterMethods );
    }
    this.response( req, res, 200, project );
  }

  protected mergeProjects( projectTree:ProjectTree, filterMethods:string[], env:string ):Project {
    var combinedProject:Project = this.getGlobalInfo();
    combinedProject.definitions = {};
    combinedProject.paths       = {};

    projectTree.projects.forEach( projectNode => {
      var project = this.injection.ProjectRepository().getAggregatedProject( env, projectNode.title, projectNode.version );
      this.filterMethods( project, filterMethods );

      if ( project.definitions ) {
        for ( var name in project.definitions ) {
          combinedProject.definitions[ name ] = project.definitions[ name ];
        }
      }

      if ( project.paths) {
        for ( var path in project.paths ) {
          if ( !combinedProject.paths[ path ]) {
            combinedProject.paths[ path ] = {};
          }
          for ( var method in project.paths[ path ] ) {
            var endpoint                    = project.paths[ path ][ method ];
            combinedProject.paths[ path ][ method ] = endpoint;
          }
        }
      }
    } );
    return combinedProject;
  }

  protected getGlobalInfo():Project {
    var project:Project = {};
    project.info        = <any>{
      title: Config.get( 'application-name' ),
      group: undefined,
      version: Config.get( 'application-version' ).toString(),
      versions: [ Config.get( 'application-version' ).toString() ],
      description: Config.get( 'application-description' )
    };
    project.schemas     = [ Config.get( 'application-schema' ) ];
    project.host        = Config.get( 'application-host' );
    project.basePath    = Config.get( 'application-basePath' );
    return project;
  }

  protected filterMethods( project:Project, requestMethods:string[] ) {
    if ( project.paths ) {
      var removePaths:string[] = [];
      for ( var path in project.paths ) {
        var removeMethods:string[] = [];
        for ( var method in project.paths[ path ] ) {
          for ( var i = 0; i < requestMethods.length; i++ ) {
            var filterMethod = requestMethods[ i ];
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
        removeMethods.forEach( removeMethod => delete project.paths[ path ][ method ] );
        if ( Object.keys( project.paths[ path ] ).length == 0 ) {
          removePaths.push( path );
        }
      }
      removePaths.forEach( removePath => delete project.paths[ removePath ] );
    }
  }

}