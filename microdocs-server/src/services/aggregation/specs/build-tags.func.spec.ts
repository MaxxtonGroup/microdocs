import { Project } from "@maxxton/microdocs-core/dist/domain";
import { buildTags } from "../funcs/build-tags.func";


describe( '#Aggregation: #buildTags:', () => {

  it( "#build path tags", () => {
    const project: Project = {
      paths: {
        "/api/v1/tags/{tagId}/text/": {},
        "/api/v1/messages/{messageId}": {}
      }
    };

    const tags = buildTags( project );

    expect(tags).toEqual( ['api', 'v1', 'tags', 'text', 'messages']);
  } );

  it( "#build definitions tags", () => {
    const project: Project = {
      definitions: {
        "com.exmample.Tag": {
          name: "Tag"
        },
        "com.exmample.Message": {
          name: "Message"
        },
      }
    };

    const tags = buildTags( project );

    expect(tags).toEqual( ['tag', 'message']);
  } );

  it( "#build query param tags", () => {
    const project: Project = {
      paths: {
        "/api/{name}": {
          get: {
            parameters: [
              {
                name: 'search',
                in: 'path'
              },
              {
                name: 'Tag',
                in: 'body'
              },
              {
                name: 'name',
                in: 'path'
              }
            ]
          }
        }
      }
    };

    const tags = buildTags( project );

    expect(tags).toEqual( ['api', 'search', 'tag', 'name']);
  } );

} );
