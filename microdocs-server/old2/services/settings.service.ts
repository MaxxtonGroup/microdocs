import { Inject, Service } from "typedi";
import { Environment, Settings } from "@maxxton/microdocs-core/domain";
import { SettingsRepository } from "../repositories/settings.repo";

/**
 * Service for settings related data
 */
@Service()
export class SettingsService {

  @Inject("settingsRepository")
  private settingsRepository: SettingsRepository;

  /**
   * Get all settings
   * @returns {Promise<Settings>}
   */
  public async getSettings(): Promise<Settings> {
    let settings:Settings = await this.settingsRepository.getSettings();
    if(!settings){
      settings = {
        envs: [
          {
            name: "default",
            default: true
          }
        ]
      };
    }
    return settings;
  }

  /**
   * Get environments
   * @returns {Promise<Environment[]>}
   */
  public async getEnvs(): Promise<Environment[]> {
    let settings = await this.getSettings();
    return settings.envs || [];
  }

  /**
   * Get environment by name
   * @param {string} envName name of the environment or empty to get the default one
   * @returns {Environment}
   */
  public async getEnv( envName?: string ): Promise<Environment> {
    let settings = await this.getSettings();
    if (!settings.envs) {
      return null;
    }
    if (envName) {
      return settings.envs.filter(env => env.name === envName)[0];
    } else {
      return settings.envs.filter(env => env.default)[0];
    }
  }

}