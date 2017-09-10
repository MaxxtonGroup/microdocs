import { Script } from "@maxxton/microdocs-core/pre-processor/script.model";
import { Environment } from "../domain/environment.model";

export abstract class ScriptRepository {

  /**
   * Load script names for an environment
   * @param env
   * @returns Promise<string[]>
   */
  public abstract async loadScriptNames( env: Environment ): Promise<string[]>;

  /**
   * Load script
   * @param env
   * @param name
   * @returns Promise<Script>
   */
  public abstract async loadScript( env: Environment, name: string ): Promise<Script>;

  /**
   * Store script
   * @param env
   * @param script
   * @returns Promise<Script>
   */
  public abstract async storeScript( env: Environment, script: Script ): Promise<Script>;

}