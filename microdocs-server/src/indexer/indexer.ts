import { App } from '@webscale/boot';
import "reflect-metadata";
import { StorageConfig } from "../config/storage.config";
import { Container } from "typedi";
import { ProcessService } from "../services/process.service";
import { ProcessOptions } from "../domain/process-options.model";

// Init app
const app = new App()
    .loadYamlFile( __dirname + "/../application.yml" )
    .config( StorageConfig )
    .start();

module.exports = function ( processOptions:ProcessOptions, callback: ( e: any, arg?: any ) => void ) {
  try {
    let processService = Container.get( ProcessService );

    processService.process( processOptions ).then( result => {
      callback( null, result );
    } ).catch( e => {
      console.error( e );
      callback( e );
    } );

  } catch ( e ) {
    console.error( e );
    callback( e );
  }
};
