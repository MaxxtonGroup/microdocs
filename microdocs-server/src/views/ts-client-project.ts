import { Project, ProjectNode, FlatList } from "@maxxton/microdocs-core/domain";

declare var extention:string;

export default function ( env:string, projects:Project[], projectNodes:ProjectNode[], projectNodesFlat:ProjectNode[], current:Project, currentNode?:ProjectNode ):any {
  let content:string = `
import { Injectable } from "@angular/core";
import { Client } from "@maxxton/angular-rest";

/**
 * ${current.info.description}
 * @author MicroDocs
 */
@Client({
  serviceId: '${current.info.title}',
  baseUrl: ''
})
@Injectable()
export class ${snakeToCamel(current.info.title)} extends RestClient {

  constructor( private rs: RestService ) {
    super(<HttpClient> rs);
  }`;

  if(current.paths){
    for(let path in current.paths){
      for(let method in current.paths[path]){
        let endpoint = current.paths[path][method];
        let endpointContent = '';
        if(method.)
      }
    }
  }

  function snakeToCamel(s:string):String{
    return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
  }

  // Return docker compose as an object
  return {
    extension: 'text',
    body: content
  };
};
