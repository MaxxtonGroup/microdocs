
import * as express from "express";

import {BaseRoute} from "./route";

/**
 * @controller
 * @baseUrl /api/v1
 */
export class ProjectRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/projects/:title', handler: this.projects};

  /**
   * Get project definition
   * @httpGet /projects/{title}
   * @httpPath title {string} name of the project
   * @httpQuery ?version {string} specify a version
   * @httpQuery ?env {string} environment to find the project definition
   * @httpResponse 200 {Project}
   * @httpResponse 400 the environment doesn't exists
   * @httpResponse 404 Project definitions for the given title/version/env doesn't exists
   */
  public projects(req: express.Request, res: express.Response, next: express.NextFunction, scope: BaseRoute) {
    const handler = scope.getHandler(req);
    try {
      const env = scope.getEnv(req, scope);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      const title = req.params.title;
      let version = req.query.version;

      const projectRepo = scope.injection.ProjectRepository();

      // load latest version if not specified
      if (version == undefined) {
        const rootNode = projectRepo.getAggregatedProjects(env);
        if (rootNode) {
          rootNode.projects.filter(project => project.title === title.toLowerCase()).forEach(project => version = project.version);
        }
      }

      if (version != undefined) {
        // load project
        const project = projectRepo.getAggregatedProject(env, title, version as string);

        // load postman collectionId
        const metadata = scope.injection.ProjectSettingsRepository().getMetadata();
        if (metadata.envs && metadata.envs[env] && metadata.envs[env].postmanCollections && metadata.envs[env].postmanCollections[title]) {
          project.info.postmanCollection = metadata.envs[env].postmanCollections[title].collectionId;
        }

        // return project
        if (project == null) {
          handler.handleNotFound(req, res);
        } else {
          handler.handleProject(req, res, project, env, scope.injection);
        }
      } else {
        handler.handleNotFound(req, res);
      }
    } catch (e) {
      scope.getDefaultHandler().handleInternalServerError(req, res, e);
    }
  }
}
