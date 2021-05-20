"use strict";

const yamlConfig = require( 'node-yaml-config' );

/**
 * Server configuration
 */
export class Config {

  /**
   * Location of the config.yml
   * @type {string}
   */
  private static configFile: string = __dirname + '/../config.yml';
  private static config: {};

  /**
   * (re)load the configuration
   */
  public static reload() {
    console.info( "load config" );
    Config.config = (yamlConfig as any).load( Config.configFile );
  }

  /**
   * Get a configuration property
   * @param path path of the property, eg. "foo.bar"
   * @returns {any} the value of the property or undefined
   */
  public static get( path: string ): any {
    const paths   = path.split( '.' );
    let current: any = Config.config;

    for ( let i = 0; i < paths.length; ++i ) {
      if ( current[ paths[ i ] ] == undefined ) {
        return undefined;
      } else {
        current = current[ paths[ i ] ];
      }
    }
    return current;
  }

  /**
   * Check if a configuration property exists
   * @param path path of the property, eg. "foo.bar"
   * @returns {boolean} true/false
   */
  public static has( path: string ): any {
    return Config.get( path ) != undefined;
  }

}

// start by loading the configuration
Config.reload();
