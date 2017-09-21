import { Script } from "@maxxton/microdocs-core/pre-processor/script.model";
import { Environment } from "../domain/environment.model";

export abstract class TemplateRepository {

  /**
   * Load template names for an environment
   * @param env
   * @param projectName
   * @returns Promise<string[]>
   */
  public abstract async loadTemplateNames( env: Environment, projectName:string ): Promise<string[]>;

  /**
   * Load template
   * @param env
   * @param projectName
   * @param name
   * @returns Promise<Script>
   */
  public abstract async loadTemplate( env: Environment, projectName:string, name: string ): Promise<Template>;

  /**
   * Store template
   * @param env
   * @param projectName
   * @param template
   * @returns Promise<Script>
   */
  public abstract async storeTemplate( env: Environment, projectName:string, template: Template ): Promise<Template>;

  /**
   * Delete template
   * @param env
   * @param projectName
   * @param name
   * @returns Promise<boolean>
   */
  public abstract async deleteTemplate( env: Environment, projectName:string, name: string ): Promise<boolean>;

}