import { App } from "@webscale/boot";
import { LoggerFactory } from '@webscale/logging';
import { storage } from "../property-keys";
import { DocumentYamlRepository } from "../repositories/yaml/document.yaml-repo";
import { Container, Inject, Service } from "typedi";

const logger = LoggerFactory.create();

const DRIVER_YAML = "yaml";

/**
 * Configure project and report storage
 */
export class StorageConfig {

  constructor( ) {
    let app = Container.get(App);
    let storageDriver = app.properties.getString(storage.driver, "yaml");

    if (storageDriver.toLowerCase() === DRIVER_YAML) {
      logger.info("Configure Yaml storage driver");
      let projectsStorageFolder = app.properties.getString(storage.yaml.projectsFolder, "data/projects");
      let reportsStorageFolder = app.properties.getString(storage.yaml.reportsFolder, "data/reports");

      let projectRepository = new DocumentYamlRepository(projectsStorageFolder);
      let reportRepository = new DocumentYamlRepository(reportsStorageFolder);

      Container.provide([
        { id: "projectRepository", value: projectRepository },
        { id: "reportRepository", value: reportRepository }
      ]);
    } else {
      throw new Error(`Invalid ${storage.driver} '${storageDriver}', expected one off: ${DRIVER_YAML}`);
    }
  }

}