import { Get, Controller, Param } from "routing-controllers";
import { Inject, Service } from "typedi";
import { SettingsService } from "../services/settings.service";
import { Environment } from "../domain/environment.model";
import { Settings } from "../domain/settings.model";

@Service()
@Controller("/api/v2")
export class SettingsController {

  @Inject()
  private settingsService: SettingsService;

  /**
   * Get settings
   * @returns {Promise<Settings>}
   */
  @Get("/settings")
  public getSettings(): Promise<Settings> {
    return this.settingsService.getSettings();
  }

  /**
   * Get all environments
   * @returns {Promise<Environment[]>}
   */
  @Get("/settings/envs")
  public getEnvironments(): Promise<Environment[]> {
    return this.settingsService.getEnvs();
  }

  /**
   * Get default environment
   * @returns {Promise<Environment>}
   */
  @Get("/settings/envs/default")
  public getDefaultEnvironment(): Promise<Environment> {
    return this.settingsService.getEnv();
  }

  /**
   * Get environment by name
   * @param {string} envName
   * @returns {Promise<Environment>}
   */
  @Get("/settings/envs/:name")
  public getEnvironment( @Param("name") envName: string ): Promise<Environment> {
    return this.settingsService.getEnv(envName);
  }

}