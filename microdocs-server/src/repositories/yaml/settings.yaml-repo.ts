import * as fs from "fs"
import * as pathUtil from "path";
import { SettingsRepository } from "../settings.repo";
import { Settings } from "../../domain/settings.model";
import { Inject, Service, Token } from "typedi";
import { App } from "@webscale/boot";
import { LoggerFactory } from "@webscale/logging";
import { storage } from "../../property-keys";
import * as yaml from "js-yaml";

const logger = LoggerFactory.create();

@Service()
export class SettingsYamlRepository extends SettingsRepository {

  @Inject()
  private app: App;

  /**
   * Load settings from /data/config/settings.json
   * @returns {Promise<Settings>}
   */
  public async getSettings(): Promise<Settings> {
    let settingsFile = pathUtil.resolve(process.cwd(),
      this.app.properties.getString(storage.yaml.settingsFile, '/data/config/settings.json'));
    logger.debug("Load settings from: ", settingsFile);
    return new Promise<Settings>((resolve, reject) => {
      fs.exists(settingsFile, exists => {
        if (exists) {
          fs.readFile(settingsFile, (err, data) => {
            if (err) {
              reject(err);
            } else {
              try {
                let string = data.toString();
                logger.silly("settings: ", string);
                let settings = yaml.safeLoad(string);
                resolve(<Settings>settings);
              } catch (e) {
                reject(e);
              }
            }
          });
        } else {
          resolve(null);
        }
      });
    });
  }

}