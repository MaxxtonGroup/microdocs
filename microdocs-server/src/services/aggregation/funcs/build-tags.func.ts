import { Project } from "@maxxton/microdocs-core/dist/domain/project.model";

/**
 * Build tags based the project endpoints and definitions
 * @param project
 * @return {string[]} list of tags
 */
export function buildTags(project:Project):string[]{
  let tags:any = {};
  if ( project.paths ) {
    for ( let path in project.paths ) {
      let segments = path.split( '/' );
      segments.forEach( segment => {
        let trimSegment = segment.trim();
        if ( trimSegment && trimSegment.indexOf('{') == -1){
          tags[ trimSegment.toLowerCase() ] = null;
        }
      } );
      for(let method in project.paths[path]){
        let endpoint = project.paths[path][method];
        if(endpoint.parameters){
          endpoint.parameters.forEach(parameter => {
            if(parameter.name){
              tags[parameter.name.toLowerCase()] = null;
            }
          })
        }
      }
    }
  }
  if ( project.definitions ) {
    for ( var name in project.definitions ) {
      let definition = project.definitions[ name ];
      if ( definition.name && definition.name.trim().length > 0 ) {
        tags[ definition.name.trim().toLowerCase() ] = null;
      }
    }
  }
  return Object.keys(tags);
}