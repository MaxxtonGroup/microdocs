import * as fs from 'fs';
import * as path from 'path';
const mkdir = require('mkdir-p');

import {Config} from "../../config";
import {ProjectRepository} from "../project.repo";
import { Project, ProjectTree, ProjectInfo } from "@maxxton/microdocs-core/domain";
import * as fsHelper from '../../helpers/file.helper';
import { Dependency } from "@maxxton/microdocs-core/domain/dependency/dependency.model";

export class ProjectJsonRepository implements ProjectRepository {

  public removeAggregatedProject(env: string, title: string, version?: string): boolean {
    console.info("Remove project: " + title + ":" + version);

    const dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    const projectFolder: string = dataFolder + "/" + title;

    if (version) {
      const storeFile: string = projectFolder + "/" + version + ".json";
      if (fs.existsSync(storeFile)) {
        fs.unlinkSync(storeFile);
        // cleanEmptyFolders(dataFolder);
        return true;
      }
    } else {
      if (fs.existsSync(projectFolder)) {
        fsHelper.deleteFolderRecursive(projectFolder);
        fsHelper.cleanEmptyFolders(dataFolder);
        return true;
      }
    }

    return false;
  }

  public getAggregatedProjects(env: string): ProjectTree {
    console.info("Load metadata");
    const dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    const metaFile: string = dataFolder + "/projects.json";
    if (fs.existsSync(metaFile)) {
      const string = fs.readFileSync(metaFile).toString();
      const json = JSON.parse(string);
      return ProjectTree.link(json);
    }
    return null;
  }

  public getAggregatedProject(env: string, title: string, version: string): Project {
    console.info("Load project: " + title + ":" + version);
    const dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    const projectFolder: string = dataFolder + "/" + title;
    const storeFile: string = projectFolder + "/" + version + ".json";
    if (fs.existsSync(storeFile)) {
      const string = fs.readFileSync(storeFile).toString();
      const json = JSON.parse(string);
      const project: any = json;
      if (project.dependencies) {
        const convertedDependencies: {[key: string]: Dependency} = {};
        for (const key in project.dependencies) {
          convertedDependencies[key.toLowerCase()] = project.dependencies[key];
        }
        project.dependencies = convertedDependencies;
      }
      project.info = new ProjectInfo(title, project.info.group, version, project.info.versions, project.info.links, project.info.description, project.info.sourceLink, project.info.publishTime, project.info.updateTime, project.info.color);
      return project;
    }
    return null;
  }

  public storeAggregatedProjects(env: string, projectTree: ProjectTree): void {
    console.info("Store metadata");
    const dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    const metaFile: string = dataFolder + "/projects.json";

    mkdir.sync(dataFolder);

    const json = JSON.stringify(projectTree.unlink());
    fs.writeFileSync(metaFile, json);
  }

  public storeAggregatedProject(env: string, project: Project): void {
    console.info("Store project: " + project.info.title + ":" + project.info.version);
    const dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    const projectFolder: string = dataFolder + "/" + project.info.title;
    const storeFile: string = projectFolder + "/" + project.info.version + ".json";

    mkdir.sync(projectFolder);

    try {
      let cache: any = [];
      const json = JSON.stringify(project, (key, value) => {
        if (key && key.length > 0 && (key.charAt(0) == "$" || key.charAt(0) == "_")) {
          return;
        }

        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            console.debug("Storing failed for project: " + project.info.title + ":" + project.info.version + ", circular ref found: " + value);
            return;
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      });

      cache = null;
      fs.writeFileSync(storeFile, json);
    } catch (e) {
      console.error("Storing failed for project: " + project.info.title + ":" + project.info.version);
      throw e;
    }
  }

}
