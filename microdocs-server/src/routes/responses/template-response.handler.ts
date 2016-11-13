/// <reference path="../../_all.d.ts" />

import * as express from "express";
import { ProjectTree, Problem, Project, Schema, ProblemLevels } from '@maxxton/microdocs-core/domain';
import { Config } from "../../config";
import * as fs from 'fs';
import * as path from 'path';
import { MicroDocsResponseHandler } from "./microdocs-response.handler";
import { Injection } from "../../injections";
import * as fsHelper from '../../helpers/file.helper';
import { ProjectNode } from "@maxxton/microdocs-core/domain/tree/project-node.model";

export class TemplateResponseHandler extends MicroDocsResponseHandler {

  constructor( private templateName:string ) {
    // Load handlebar functions
    let srcView      = path.join( __dirname, '../../views' );
    let externalView = path.join( __dirname, '../../../' + Config.get( "dataFolder" ) + '/config/templates' );
    let srcFuncs = path.join(srcView, 'handlebars-functions.js');
    let externalFuncs = path.join(externalView, 'handlebars-functions.js');
    if(fs.existsSync(srcFuncs)){
      require(srcFuncs);
    }
    if(fs.existsSync(externalFuncs)){
      require(externalFuncs);
    }
  }

  handleProjects( req:express.Request, res:express.Response, projectTree:ProjectTree, env:string, injection:Injection ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Content-Type', 'text/plain' );

    let projectsViewFile = this.findViewFile( 'projects' );
    let projectViewFile  = this.findViewFile( 'project' );
    if ( projectsViewFile != null ) {
      var global   = this.getGlobalInfo();
      var projects = [];
      projectTree.projects.forEach( projectNode => {
        var project = injection.ProjectRepository().getAggregatedProject( env, projectNode.title, projectNode.version );

        if ( req.query[ 'method' ] ) {
          var filterMethods = req.query[ 'method' ].split( ',' );
          this.filterMethods( project, filterMethods );
        }
        projects.push( project );
      } );
      res.render( projectsViewFile, {
        projects: projects,
        info: global,
        projectNodes: projectTree.projects,
        projectNodesFlat: projectTree.toFlatList(),
        env: env
      } );

    } else if ( projectViewFile != null ) {
      var filterMethods = [];
      if ( req.query[ 'method' ] ) {
        filterMethods = req.query[ 'method' ].split( ',' );
      }
      var project = this.mergeProjects( projectTree, filterMethods, env, injection );
      this.handleProject( req, res, project, env, injection );

    } else {
      this.handleBadRequest( req, res, "Unknown export type: " + this.templateName );
    }
  }

  handleProject( req:express.Request, res:express.Response, project:Project, env:string, injection:Injection ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Content-Type', 'text/plain' );

    let projectTree = injection.ProjectRepository().getAggregatedProjects( env );
    let projectsViewFile = this.findViewFile( 'projects' );
    let projectViewFile  = this.findViewFile( 'project' );
    if (projectViewFile != null || projectsViewFile != null) {
      if ( req.query[ 'method' ] ) {
        var filterMethods = req.query[ 'method' ].split( ',' );
        this.filterMethods( project, filterMethods );
      }

      let excludeSelf = false;
      if ( req.query[ 'exclude-self' ] === 'true' ) {
        excludeSelf = true;
      }

      let nodePath    = projectTree.findNodePath( project.info.title, project.info.version );
      let projectNode = <ProjectNode>projectTree.resolveReference( '#' + nodePath );
      let projectNodes = projectNode != null ? [projectNode] : [];
      let flatList = projectNode != null ? projectNode.toFlatList( excludeSelf ) : [];

      res.render( projectViewFile != null ? projectViewFile : projectsViewFile, {
        info: project,
        env: env,
        projectNodes: projectNodes,
        projectNodesFlat: flatList
      } );
    }else{
      this.handleBadRequest( req, res, "Unknown export type: " + this.templateName );
    }
  }

  handleProblems( req:express.Request, res:express.Response, problems:Problem[], env:string ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Content-Type', 'text/plain' );
    let problemsViewFile = this.findViewFile( 'problems' );
    if ( problemsViewFile != null ) {
      var object = { problems: problems };
      if ( problems.filter( problem => problem.level == ProblemLevels.ERROR || problem.level == ProblemLevels.WARNING ).length == 0 ) {
        object[ 'status' ]  = 'ok';
        object[ 'message' ] = 'No problems found';
      } else {
        object[ 'status' ]  = 'failed';
        object[ 'message' ] = problems.length + " problem" + (problems.length > 1 ? 's' : '') + " found";
      }
      res.render( problemsViewFile, object );
    } else {
      this.handleBadRequest( req, res, "Unknown export type: " + this.templateName );
    }
  }

  private findViewFile( type:string ):string {
    let externalView = path.join( __dirname, '../../../' + Config.get( "dataFolder" ) + '/config/templates' );
    let srcView      = path.join( __dirname, '../../views' );

    let externalViews   = fsHelper.getFiles( externalView );
    let externalResults = externalViews.filter( view => view.indexOf( this.templateName ) == 0 && view.lastIndexOf( '-' + type + '.handlebars' ) == view.length - ('-' + type + '.handlebars').length );
    if ( externalResults.length > 0 ) {
      return path.join( externalView, externalResults[ 0 ] );
    }

    let srcViews   = fsHelper.getFiles( srcView );
    let srcResults = srcViews.filter( view => view.indexOf( this.templateName ) == 0 && view.lastIndexOf( '-' + type + '.handlebars' ) == view.length - ('-' + type + '.handlebars').length );
    if ( srcResults.length > 0 ) {
      return path.join( __dirname, '../../views', srcResults[ 0 ] );
    }
    return null;
  }

}