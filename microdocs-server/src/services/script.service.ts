import { Inject, Service } from "typedi";
import { Environment } from "../domain/environment.model";
import { Script } from "@maxxton/microdocs-core/pre-processor/script.model";
import { ScriptYamlRepository } from "../repositories/yaml/script.yaml-repo";

/**
 * Manage preprocess scripts
 */
@Service()
export class ScriptService {

  @Inject()
  private scriptRepository: ScriptYamlRepository;

  /**
   * Get the names of the scripts for an environment
   * @param env
   * @return {Promise<string[]>}
   */
  public getScriptNames( env: Environment ): Promise<string[]> {
    return this.scriptRepository.loadScriptNames( env );
  }

  /**
   * Get all scripts for an environment
   * @param env
   * @return {Promise<Script[]>}
   */
  public async getScripts( env: Environment ): Promise<Script[]> {
    let scriptNames = await this.scriptRepository.loadScriptNames(env);
    let promises = scriptNames.map(name => this.scriptRepository.loadScript(env, name));
    return Promise.all(promises);
  }

  /**
   * Get a script by name
   * @param env
   * @param name name of the script
   * @return {Promise<Script>}
   */
  public getScript( env: Environment, name: string ): Promise<Script> {
    return this.scriptRepository.loadScript( env, name );
  }

  /**
   * Delete a script by name
   * @param env
   * @param name name of the script
   * @return {Promise<Script>}
   */
  public deleteScript( env: Environment, name: string ): Promise<Script> {
    return this.scriptRepository.deleteScript( env, name );
  }

  /**
   * Add a new script
   * @param env
   * @param script
   * @return {Promise<Script>}
   */
  public addScript( env: Environment, script: Script ): Promise<Script> {
    return this.scriptRepository.storeScript(env, script);
  }

}