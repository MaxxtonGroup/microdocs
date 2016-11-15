/// <reference path="../../../../typings/index.d.ts" />
import { assert } from 'chai';
import { Project } from "@maxxton/microdocs-core/domain";
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

    assert.deepEqual(tags, ['api', 'v1', 'tags', 'text', 'messages']);
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

    assert.deepEqual(tags, ['tag', 'message']);
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

    assert.deepEqual(tags, ['api', 'search', 'tag', 'name']);
  } );

} );