import * as fs from "fs"
import * as pathUtil from "path";
import { SettingsRepository } from "../settings.repo";
import { Settings } from "@maxxton/microdocs-core/domain";
import { Inject, Service, Token } from "typedi";
import { App } from "@webscale/boot";
import { LoggerFactory } from "@webscale/logging";
import { storage } from "../../property-keys";

const logger   = LoggerFactory.create();
const JSON_EXT = ".json";

export class SettingsJsonRepository extends SettingsRepository {

  constructor(private settingsFile:string){
    super();
  }

  /**
   * Load settings from /data/config/settings.json
   * @returns {Promise<Settings>}
   */
  public async getSettings(): Promise<Settings> {
    return new Promise<Settings>( ( resolve, reject ) => {
      fs.exists( this.settingsFile, exists => {
        if ( exists ) {
          fs.readFile( this.settingsFile, ( err, data ) => {
            if ( err ) {
              reject( err );
            } else {
              try {
                let string = data.toString();
                logger.silly( "settings: ", string );
                let settings = JSON.parse(string );
                resolve( <Settings>settings );
              } catch ( e ) {
                reject( e );
              }
            }
          } );
        } else {
          resolve( null );
        }
      } );
    } );
  }

}