
import * as express from "express";
import { ProjectTree, Problem, Project, Schema, ProblemLevels, FlatList, ProblemResponse } from '@maxxton/microdocs-core/dist/domain';
import { Config } from "../../config";
import * as fs from 'fs';
import * as path from 'path';
import * as fsHelper from '../../helpers/file.helper';
import { MicroDocsResponseHandler } from "./microdocs-response.handler";
import * as Handlebars from 'handlebars';
import { Injection } from "../../injections";
import { ProjectNode } from "@maxxton/microdocs-core/dist/domain/tree/project-node.model";

export class TemplateResponseHandler extends MicroDocsResponseHandler {

  constructor( injection: Injection, private templateName: string ) {
    super( injection );
    // Load handlebar functions
    const srcView       = path.join( __dirname, '../../views' );
    const externalView  = path.join( __dirname, '../../../' + Config.get( "dataFolder" ) + '/config/templates' );
    const srcFuncs      = path.join( srcView, 'handlebars-functions.js' );
    const externalFuncs = path.join( externalView, 'handlebars-functions.js' );
    if ( fs.existsSync( srcFuncs ) ) {
      require( srcFuncs );
    }
    if ( fs.existsSync( externalFuncs ) ) {
      require( externalFuncs );
    }
  }

  handleProjects( req: express.Request, res: express.Response, projectTree: ProjectTree, env: string ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Content-Type', 'text/plain' );

    const projectsViewFile   = this.findViewFile( 'projects', 'handlebars' );
    const projectsScriptFile = this.findViewFile( 'projects', 'js' );
    const projectViewFile    = this.findViewFile( 'project', 'handlebars' );
    const projectScriptFile  = this.findViewFile( 'project', 'js' );
    if ( projectsViewFile != null || projectsScriptFile != null ) {
      const global             = this.getGlobalInfo();
      const projects: Array<Project> = [];
      projectTree.projects.forEach( projectNode => {
        const project = this.injection.ProjectRepository().getAggregatedProject( env, projectNode.title, projectNode.version );

        if ( req.query[ 'method' ] ) {
          const filterMethods = (req.query[ 'method' ] as string).split( ',' );
          this.filterMethods( project, filterMethods );
        }
        projects.push( project );
      } );
      if ( projectsScriptFile != null ) {
        this.renderScript( projectsScriptFile, {
          projects,
          info: global,
          projectNodes: projectTree.projects,
          projectNodesFlat: projectTree.toFlatList(),
          env
        }, res );
      } else {
        res.render( projectsViewFile, {
          projects,
          info: global,
          projectNodes: projectTree.projects,
          projectNodesFlat: projectTree.toFlatList(),
          env
        } );
      }

    } else if ( projectViewFile != null ) {
      let filterMethods: Array<string> = [];
      if ( req.query[ 'method' ] ) {
        filterMethods = (req.query[ 'method' ] as string).split( ',' );
      }
      const project = this.mergeProjects( projectTree, filterMethods, env );
      this.handleProject( req, res, project, env );

    } else {
      this.handleBadRequest( req, res, "Unknown export type: " + this.templateName );
    }
  }

  handleProject( req: express.Request, res: express.Response, project: Project, env: string ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Content-Type', 'text/plain' );

    const projectTree        = this.injection.ProjectRepository().getAggregatedProjects( env );
    const projectsViewFile   = this.findViewFile( 'projects', 'handlebars' );
    const projectsScriptFile = this.findViewFile( 'projects', 'js' );
    const projectViewFile    = this.findViewFile( 'project', 'handlebars' );
    const projectScriptFile  = this.findViewFile( 'project', 'js' );
    if ( projectViewFile != null || projectsViewFile != null || projectsScriptFile != null || projectScriptFile != null ) {
      if ( req.query[ 'method' ] ) {
        const filterMethods = (req.query[ 'method' ] as string).split( ',' );
        this.filterMethods( project, filterMethods );
      }

      let buildSelf = false;
      if ( req.query[ 'build-self' ] === 'true' ) {
        buildSelf = true;
      }

      const nodePath: string            = projectTree.findNodePath( project.info.title, project.info.version );
      const projectNode: ProjectNode    = projectTree.resolveReference( '#' + nodePath ) as ProjectNode;
      // let projectNodes:ProjectNode[] = projectNode != null ? [ projectNode ] : [];
      // let flatList:FlatList          = projectNode != null ? projectNode.toFlatList( false ) : new FlatList();
//      let projects:Project[]         = flatList.map<Project>( n => {
//        if ( n.title === project.info.title && n.version === project.info.version ) {
//          return project;
//        } else {
//          return this.injection.ProjectRepository().getAggregatedProject( env, n.title, n.version );
//        }
//      } ).filter( p => p );

      if ( projectsScriptFile != null || projectScriptFile != null ) {
        this.renderScript( projectsScriptFile != null ? projectsScriptFile : projectScriptFile, {
          info: project,
          env,
          projectNodes: [], // projectNodes,
          projectNodesFlat: new FlatList(), // flatList,
          currentNode: buildSelf ? projectNode : undefined,
          projects: [ project ]
        }, res );
      } else {
        res.render( projectViewFile != null ? projectViewFile : projectsViewFile, {
          info: project,
          env,
          projectNodes: [], // projectNodes,
          projectNodesFlat: new FlatList(), // flatList,
          currentNode: projectNode
        } );
      }
    } else {
      this.handleBadRequest( req, res, "Unknown export type: " + this.templateName );
    }
  }

  handleProblems( req: express.Request, res: express.Response, problems: Array<Problem>, env: string ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Content-Type', 'text/plain' );
    const problemsViewFile = this.findViewFile( 'problems', 'handlebars' );
    if ( problemsViewFile != null ) {
      const object: ProblemResponse = { problems };
      if ( problems.filter( problem => problem.level == ProblemLevels.ERROR || problem.level == ProblemLevels.WARNING ).length == 0 ) {
        object.status  = 'ok';
        object.message = 'No problems found';
      } else {
        object.status = 'failed';
        object.message = problems.length + " problem" + (problems.length > 1 ? 's' : '') + " found";
      }
      res.render( problemsViewFile, object );
    } else {
      this.handleBadRequest( req, res, "Unknown export type: " + this.templateName );
    }
  }

  private findViewFile( type: string, ext: string ): string {
    const externalView = path.join( __dirname, '../../../' + Config.get( "dataFolder" ) + '/config/templates' );
    const srcView      = path.join( __dirname, '../../views' );

    const externalViews   = fsHelper.getFiles( externalView );
    const externalResults = externalViews.filter( view => view.indexOf( this.templateName ) == 0 && view.lastIndexOf( '-' + type + '.' + ext ) == view.length - ('-' + type + '.' + ext).length );
    if ( externalResults.length > 0 ) {
      return path.join( externalView, externalResults[ 0 ] );
    }

    const srcViews   = fsHelper.getFiles( srcView );
    const srcResults = srcViews.filter( view => view.indexOf( this.templateName ) == 0 && view.lastIndexOf( '-' + type + '.' + ext ) == view.length - ('-' + type + '.' + ext).length );
    if ( srcResults.length > 0 ) {
      return path.join( __dirname, '../../views', srcResults[ 0 ] );
    }
    return null;
  }


  private renderScript( fileName: string, params: {info: Project; env: string; projectNodes: (Array<ProjectNode>|Array<any>); projectNodesFlat: FlatList; currentNode?: ProjectNode, projects: Array<Project>}, res: express.Response) {
    let result: any;
    (function () {
      let func: ( env: string, projects: Array<Project>, projectNodes: Array<ProjectNode>, projectNodesFlat: Array<ProjectNode>, current: Project, currentNode?: ProjectNode ) => {extension: string, body: any};
      func   = require( fileName ).default;
      result = func( params.env, params.projects, params.projectNodes, params.projectNodesFlat, params.info, params.currentNode );
    })();
    if (!result.extension) {
      result.extension = 'text';
    }
    res.header('Content-Disposition', 'inline; filename="' + this.templateName + '.' + result.extension);
    switch (result.extension.toLowerCase()) {
      case 'text':
        this.responseText(res, 200, result.body);
        break;
      case 'json':
        this.responseJson(res, 200, result.body);
        break;
      case 'yml':
      case 'yaml':
        this.responseYaml(res, 200, result.body);
        break;
      case 'xml':
        this.responseYaml(res, 200, result.body);
        break;
      default:
        throw new Error("Unknown response mime type: " + result.extension);
    }
  }

}
