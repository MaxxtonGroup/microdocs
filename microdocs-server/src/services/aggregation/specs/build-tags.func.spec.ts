import { Project } from "@maxxton/microdocs-core/dist/domain";
import { buildTags } from "../funcs/build-tags.func";


describe( '#Aggregation: #buildTags:', () => {

  it( "#build path tags", () => {
    let project:Project = {
      paths: {
        "/api/v1/tags/{tagId}/text/": {},
        "/api/v1/messages/{messageId}": {}
      }
    };

    let tags = buildTags( project );

    expect(tags).toEqual( ['api', 'v1', 'tags', 'text', 'messages']);
  } );

  it( "#build definitions tags", () => {
    let project:Project = {
      definitions: {
        "com.exmample.Tag": {
          name: "Tag"
        },
        "com.exmample.Message": {
          name: "Message"
        },
      }
    };

    let tags = buildTags( project );

    expect(tags).toEqual( ['tag', 'message']);
  } );

  it( "#build query param tags", () => {
    let project:Project = {
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

    let tags = buildTags( project );

    expect(tags).toEqual( ['api', 'search', 'tag', 'name']);
  } );

} );