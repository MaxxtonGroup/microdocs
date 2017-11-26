
import { Inject, Service } from "typedi";
import { Environment } from "@maxxton/microdocs-core/domain";
import { Template } from "@maxxton/microdocs-core/template";
import { TemplateYamlRepository } from "../repositories/yaml/template.yaml-repo";
import { Project } from "@maxxton/microdocs-core/domain";

const GLOBAL_PREFIX = "__global__";

@Service()
export class TemplateService {

  @Inject()
  private templateRepository:TemplateYamlRepository;

  /**
   * Get template Names
   * @param {Environment} env
   * @param {Project} project
   * @returns {Promise<string[]>}
   */
  public async getTemplateNames(env:Environment, project?:Project):Promise<string[]> {
    let names = await this.templateRepository.loadTemplateNames(env, GLOBAL_PREFIX);
    if(project){
      let projectNames = await this.templateRepository.loadTemplateNames(env, project.id);
      names = names.concat(projectNames)
    }
    return names;
  }

  /**
   * Get template by name
   * @param {Environment} env
   * @param {string} templateName
   * @param {Project} project for a project or global
   * @returns {Promise<Template>}
   */
  public async getTemplate(env:Environment, templateName:string, project?:Project):Promise<Template> {
    if(project){
      let template = await this.templateRepository.loadTemplate(env, project.id, templateName);
      if(!template){
        return template;
      }
    }
    return await this.templateRepository.loadTemplate(env, GLOBAL_PREFIX, templateName);
  }

  /**
   * Create template
   * @param {Environment} env
   * @param template
   * @param {Project} project
   * @returns {Promise<Template>}
   */
  public async createTemplate(env:Environment, template:Template, project?:Project):Promise<Template> {
    let prefix = project ? project.id : GLOBAL_PREFIX;
    return await this.templateRepository.storeTemplate(env, prefix, template);
  }

  /**
   * Edit template
   * @param {Environment} env
   * @param template
   * @param {Project} project
   * @returns {Promise<Template>}
   */
  public async editTemplate(env:Environment, template:Template, project?:Project):Promise<Template> {
    let prefix = project ? project.id : GLOBAL_PREFIX;
    return await this.templateRepository.storeTemplate(env, prefix, template);
  }

  /**
   * Delete template
   * @param {Environment} env
   * @param templateName
   * @param {Project} project
   * @returns {Promise<boolean>}
   */
  public async deleteTemplate(env:Environment, templateName:string, project?:Project):Promise<boolean> {
    let prefix = project ? project.id : GLOBAL_PREFIX;
    return await this.templateRepository.deleteTemplate(env, prefix, templateName);
  }

}