import { Project } from "@maxxton/microdocs-core/domain/project.model";

/**
 * Build tags based the project endpoints and definitions
 * @param project
 * @return {string[]} list of tags
 */
export function buildTags(project:Project):string[]{
  let tags:{} = {};
  if ( project.paths ) {
    for ( let path in project.paths ) {
      let segments = path.split( '/' );
      segments.forEach( segment => {
        let trimSegment = segment.trim();
        if ( trimSegment && trimSegment.length > 0 && (trimSegment.indexOf( '{' ) != 0 || trimSegment.indexOf( '}' ) != trimSegment.length - 1) ) {
          tags[ trimSegment.toLowerCase() ] = null;
        }
      } );
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