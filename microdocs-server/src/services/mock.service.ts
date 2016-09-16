import * as express from "express";
import {Project, Path} from "microdocs-core-ts/dist/domain";
export class MockService {

  public static bootstrap(): MockService {
    return new MockService();
  }

  public mockResponse(request: express.Request, response: express.Response, title?:string, version?:string, env?:string) {

  }

  public findEndpoint(request: express.Request, path: string, project: Project): Path {
    var pathExists = false;
    var method = request.method.toLowerCase;
    if (project.paths) {
      if (project.paths[path]) {
        if (project.paths[path][method]) {
          return project.paths[path][method];
        }
        pathExists = true;
      }

      var segments = path.split("/");
      for (var p in project.paths) {
        var pSegments = p.split("/");
        var same = true;
        if (segments.length == pSegments.length) {
          for (var i = 0; i < segments.length; i++) {
            if (segments[i] !== pSegments[i]) {
              if (!(pSegments[i].indexOf('{') == 0 && pSegments[i].indexOf('}') == pSegments[i].length - 1)) {
                same = false;
              }
            }
            if (!same) {
              break;
            }
          }
          if(same){
            var endpoint = project.paths[p];
            if(endpoint[method]){
              return endpoint[method];
            }
            pathExists = true;
          }
        }
      }
    }

    if(pathExists){
      throw new MethodNotAllowedException();
    }

    return null;
  }


}