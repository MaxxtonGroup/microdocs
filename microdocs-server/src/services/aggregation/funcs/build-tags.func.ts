import { Project } from "@maxxton/microdocs-core/domain/project.model";

/**
 * Build tags based the project endpoints and definitions
 * @param project
 * @return {string[]} list of tags
 */
export function buildTags(project: Project): Array<string> {
  const tags: any = {};
  if ( project.paths ) {
    for ( const path in project.paths ) {
      const segments = path.split( '/' );
      segments.forEach( segment => {
        const trimSegment = segment.trim();
        if ( trimSegment && trimSegment.indexOf('{') == -1) {
          tags[ trimSegment.toLowerCase() ] = null;
        }
      } );
      for (const method in project.paths[path]) {
        const endpoint = project.paths[path][method];
        if (endpoint.parameters) {
          endpoint.parameters.forEach(parameter => {
            if (parameter.name) {
              tags[parameter.name.toLowerCase()] = null;
            }
          });
        }
      }
    }
  }
  if ( project.definitions ) {
    for ( const name in project.definitions ) {
      const definition = project.definitions[ name ];
      if ( definition.name && definition.name.trim().length > 0 ) {
        tags[ definition.name.trim().toLowerCase() ] = null;
      }
    }
  }
  return Object.keys(tags);
}
