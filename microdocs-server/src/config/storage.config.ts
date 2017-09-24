import { App } from "@webscale/boot";
import { LoggerFactory } from '@webscale/logging';
import { storage } from "../property-keys";
import { DocumentYamlRepository } from "../repositories/yaml/document.yaml-repo";
import { Container, Inject, Service } from "typedi";
import { DocumentJsonRepository } from "../repositories/json/document.json-repo";
import { ScriptYamlRepository } from "../repositories/yaml/script.yaml-repo";
import * as pathUtil from "path";
import { SettingsYamlRepository } from "../repositories/yaml/settings.yaml-repo";
import { DocumentRepository } from "../repositories/document.repo";
import { ScriptRepository } from "../repositories/script.repo";
import { SettingsRepository } from "../repositories/settings.repo";
import { ScriptJsonRepository } from "../repositories/json/script.json-repo";
import { SettingsJsonRepository } from "../repositories/json/settings.json-repo";

const logger = LoggerFactory.create();

const DRIVER_YAML = "yaml";
const DRIVER_JSON = "json";

/**
 * Configure project and report storage
 */
export class StorageConfig {

  constructor() {
    let app           = Container.get( App );
    let storageDriver = app.properties.getString( storage.driver, DRIVER_JSON );

    let projectRepository: DocumentRepository;
    let reportRepository: DocumentRepository;
    let scriptRepository: ScriptRepository;
    let settingsRepository: SettingsRepository;

    if ( storageDriver.toLowerCase() === DRIVER_YAML ) {
      logger.info( "Configure Yaml storage driver" );
      let projectsStorageFolder = app.properties.getString( storage.yaml.projectsFolder, "data/projects" );
      let reportsStorageFolder  = app.properties.getString( storage.yaml.reportsFolder, "data/reports" );
      let scriptFolder          = pathUtil.resolve( process.cwd(), app.properties.getString( storage.yaml.scriptsFolder, 'data/config/scripts' ) );
      let settingsFile          = pathUtil.resolve( process.cwd(), app.properties.getString( storage.yaml.settingsFile, 'data/config/settings.yaml' ) );

      projectRepository  = new DocumentYamlRepository( projectsStorageFolder );
      reportRepository   = new DocumentYamlRepository( reportsStorageFolder );
      scriptRepository   = new ScriptYamlRepository( scriptFolder );
      settingsRepository = new SettingsYamlRepository( settingsFile );

    } else if ( storageDriver.toLowerCase() === DRIVER_JSON ) {
      logger.info( "Configure Json storage driver" );
      let projectsStorageFolder = app.properties.getString( storage.json.projectsFolder, "data/projects" );
      let reportsStorageFolder  = app.properties.getString( storage.json.reportsFolder, "data/reports" );
      let scriptFolder          = pathUtil.resolve( process.cwd(), app.properties.getString( storage.json.scriptsFolder, 'data/config/scripts' ) );
      let settingsFile          = pathUtil.resolve( process.cwd(), app.properties.getString( storage.json.settingsFile, 'data/config/settings.json' ) );

      projectRepository = new DocumentJsonRepository( projectsStorageFolder );
      reportRepository  = new DocumentJsonRepository( reportsStorageFolder );
      scriptRepository   = new ScriptJsonRepository( scriptFolder );
      settingsRepository = new SettingsJsonRepository( settingsFile );

    } else {
      throw new Error( `Invalid ${storage.driver} '${storageDriver}', expected one off: ${DRIVER_YAML}` );
    }

    Container.provide( [
      { id: "projectRepository", value: projectRepository },
      { id: "reportRepository", value: reportRepository },
      { id: "scriptRepository", value: scriptRepository },
      { id: "settingsRepository", value: settingsRepository }
    ] );
  }

}