#!/usr/bin/env node
/// <reference path="../typings/index.d.ts" />

import * as pjson from '../package.json';
import * as program from 'commander';
import { ClusterOptions } from "./options/cluster.options";
import { DockerClusterService } from "./docker/docker-cluster.service";

function list( val: string ) {
  return val.split( ',' );
}

program
    .version( pjson.version )
    .usage( "[command]" )
    .description( "Local docker cluster" );

program
    .command( 'up' )
    .usage( "[options] <project|all>" )
    .description( "Start local docker cluster" )
    .option( '-c, --cluster <name>', 'Set the name of the cluster', 'default' )
    .option( '-e, --env <env>', 'Set the environment of MicroDocs to pull from' )
    .option( '-g, --group <groups>', 'Filter on groups, use ! in front of the group name to exclude' )
    .option( '-q, --project <projects>', 'Filter on projects, use ! in front of the project name to exclude' )
    .option( '-b, --build [dockerfile]', 'Build this project first' )
    .option( '-d, --buildContext <dir>', 'Build directory' )
    .option( '-a, --buildArgs <args>', 'Build arguments', list )
    .option( '-de, --denv <denv>', 'Set docker environment variables', list )
    .option( '-dp, --dpublish <dpublish>', 'Publish docker ports to the host', list )
    .option( '-dv, --dvolume <dvolume>', 'Bind mount a docker volume', list )
    .option( '-s, --server <url>', 'Url of the MicroDocs server', 'http://localhost:3000' )
    .option( '-u, --username <user>', 'Username to access the MicroDocs server' )
    .option( '-p, --password <password>', 'Password to access the MicroDocs server' )
    .action( function ( env: any ) {
      if ( env[ 1 ] ) {
        let clusterOptions = getClusterOptions( this );
        if ( env !== 'all' ) {
          clusterOptions.targetProject = env.indexOf( ':' )[ 0 ];
          clusterOptions.targetVersion = env.indexOf( ':' )[ 1 ];
        }

        let dockerClusterService = new DockerClusterService();
        dockerClusterService.up( clusterOptions );

        return false;
      }
      this.help();
      return true;
    } );

program
    .command( "down" )
    .usage( "[options] <project|all>" )
    .option( '-c, --cluster <name>', 'Set the name of the cluster', 'default' )
    .option( '-v, --volumes', 'Remove docker volumes', list )
    .action( function ( env: any ) {
      if ( env[ 1 ] ) {
        let clusterOptions = getClusterOptions( this );
        if ( env !== 'all' ) {
          clusterOptions.targetProject = env.indexOf( ':' )[ 0 ];
          clusterOptions.targetVersion = env.indexOf( ':' )[ 1 ];
        }

        let dockerClusterService = new DockerClusterService();
        dockerClusterService.down( clusterOptions );

        return false;
      }
      this.help();
      return true;
    } );


program
    .command( '' )
    .action( function ( env ) {
      program.help();
    } );

program.parse( process.argv );

if ( program.args.length == 0 ) {
  program.help();
}

function getClusterOptions( options: any ): ClusterOptions {
  var clusterOptions: ClusterOptions = {
    url: options.server
  };
  if ( options.username ) {
    clusterOptions.username = options.username;
  }
  if ( options.password ) {
    clusterOptions.password = options.password;
  }
  if ( options.cluster ) {
    clusterOptions.clusterName = options.cluster;
  }
  if ( options.env ) {
    clusterOptions.env = options.env;
  }
  if ( options.group ) {
    clusterOptions.filterGroups = options.group;
  }
  if ( options.project ) {
    clusterOptions.filterProjects = options.project;
  }
  if ( options.denv ) {
    clusterOptions.denv = options.denv;
  }
  if ( options.dpublish ) {
    clusterOptions.dpublish = options.dpublish;
  }
  if ( options.dvolume ) {
    clusterOptions.dvolume = options.dvolume;
  }
  if ( options.build ) {
    clusterOptions.build = true;
    if ( typeof(options.build) === 'string' ) {
      clusterOptions.dockerfile = options.build;
    }
  }
  if ( options.buildContext ) {
    clusterOptions.buildContext = clusterOptions.buildContext;
  }
  if ( options.buildArgs ) {
    clusterOptions.buildArgs = {};
    options.buildArgs.forEach( ( arg: string ) => {
      let pair                              = arg.split( '=' );
      clusterOptions.buildArgs[ pair[ 0 ] ] = pair[ 1 ];
    } );
  }
  return clusterOptions;
}