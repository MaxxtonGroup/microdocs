import { ProblemReporter } from "@maxxton/microdocs-core/dist/helpers";
import { Path, SchemaTypes, Parameter, Schema } from "@maxxton/microdocs-core/dist/domain";
import { checkQueryParameters, checkPathParameters, checkBodyParameters, checkResponseBody } from "../funcs";

describe('#Aggregation: #endpointCheck:', () => {

  describe('#queryCheck', () => {

    it('No query parameters', () => {
      const problemReport = new ProblemReporter();

      // client with no query parameters
      const clientEndpoint: Path = {
        parameters: []
      } as Path;

      // producer with no query parameters
      const producerEndpoint: Path = {
        parameters: []
      } as Path;

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Missing query parameters', () => {
      const problemReport = new ProblemReporter();

      // client with no query parameters
      const clientEndpoint: Path = {
        parameters: []
      } as Path;

      // producer with no query parameters
      const producerEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search'
          }
        ]
      } as Path;

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Missing required query parameters', () => {
      const problemReport = new ProblemReporter();

      // client with no query parameters
      const clientEndpoint: Path = {
        parameters: []
      } as Path;

      // producer with no query parameters
      const producerEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            required: true
          }
        ]
      } as Path;

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('Matching query types', () => {
      const problemReport = new ProblemReporter();

      // client with string query param
      const clientEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true
          }
        ]
      } as Path;

      // producer with same query param
      const producerEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true
          }
        ]
      } as Path;

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Mismatching query types', () => {
      const problemReport = new ProblemReporter();

      // client with string query param
      const clientEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true
          }
        ]
      } as Path;

      // producer with same query param
      const producerEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'number',
            required: true
          }
        ]
      } as Path;

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('Matching enum query type', () => {
      const problemReport = new ProblemReporter();

      // client with string query param
      const clientEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true,
            default: 'application',
          }
        ]
      } as Path;

      // producer with same query param
      const producerEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'enum',
            required: true,
            'enum': ['application']
          }
        ]
      } as Path;

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Matching reverse enum query type', () => {
      const problemReport = new ProblemReporter();

      // client with string query param
      const clientEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'enum',
            required: true,
            'enum': ['application']
          }
        ]
      } as Path;

      // producer with same query param
      const producerEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true,
            default: 'application',
          }
        ]
      } as Path;

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Matching any query type', () => {
      const problemReport = new ProblemReporter();

      // client with string query param
      const clientEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'any',
            required: true
          }
        ]
      } as Path;

      // producer with same query param
      const producerEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'number',
            required: true
          }
        ]
      } as Path;

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Mismatching not required query types', () => {
      const problemReport = new ProblemReporter();

      // client with string query param
      const clientEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string'
          }
        ]
      } as Path;

      // producer with same query param
      const producerEndpoint: Path = {
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'number',
            required: false
          }
        ]
      } as Path;

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });
  });

  describe('#pathCheck', () => {
    it('No path parameters', () => {
      const problemReport = new ProblemReporter();

      // client with no path parameters
      const clientEndpoint: Path = {
        path: '/api/v1/something'
      } as Path;

      // producer with no path parameters
      const producerEndpoint: Path = {
        path: '/api/v1/something'
      } as Path;

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Client with path parameter', () => {
      const problemReport = new ProblemReporter();

      // client with path parameter
      const clientEndpoint: Path = {
        path: '/api/v1/{param}'
      } as Path;

      // producer with no path parameters
      const producerEndpoint: Path = {
        path: '/api/v1/something'
      } as Path;

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Producer with path parameter', () => {
      const problemReport = new ProblemReporter();

      // client with path parameter
      const clientEndpoint: Path = {
        path: '/api/v1/something'
      } as Path;

      // producer with no path parameters
      const producerEndpoint: Path = {
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.STRING,
            required: true
          }
        ]
      } as Path;

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Same type path parameter', () => {
      const problemReport = new ProblemReporter();

      // client with path parameter
      const clientEndpoint: Path = {
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.INTEGER,
            required: true
          }
        ]
      } as Path;

      // producer with no path parameters
      const producerEndpoint: Path = {
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.INTEGER,
            required: true
          }
        ]
      } as Path;

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Mismatch type path parameter', () => {
      const problemReport = new ProblemReporter();

      // client with path parameter
      const clientEndpoint: Path = {
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.INTEGER,
            required: true
          }
        ]
      } as Path;

      // producer with no path parameters
      const producerEndpoint: Path = {
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.BOOLEAN,
            required: true
          }
        ]
      } as Path;

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('Client param not found', () => {
      const problemReport = new ProblemReporter();

      // client with path parameter
      const clientEndpoint: Path = {
        path: '/api/v1/{param}'
      } as Path;

      // producer with no path parameters
      const producerEndpoint: Path = {
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.BOOLEAN,
            required: true
          }
        ]
      } as Path;

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('Producer param not found', () => {
      const problemReport = new ProblemReporter();

      // client with path parameter
      const clientEndpoint: Path = {
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.BOOLEAN,
            required: true
          }
        ]
      } as Path;

      // producer with no path parameters
      const producerEndpoint: Path = {
        path: '/api/v1/{param}'
      } as Path;

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('Client with number instead of param', () => {
      const problemReport = new ProblemReporter();

      // client with path parameter
      const clientEndpoint: Path = {
        path: '/api/v1/5'
      } as Path;

      // producer with no path parameters
      const producerEndpoint: Path = {
        path: '/api/v1/{param}',
        parameters: [
          {
            name: 'param',
            'in': 'path',
            type: SchemaTypes.NUMBER,
            required: true
          }
        ]
      } as Path;

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });
  });

  describe('#bodyCheck', () => {
    it('ignore body when not required', () => {
      const problemReport = new ProblemReporter();
      // client without body
      const clientEndpoint: Path = {
        parameters: []
      } as Path;
      // producer with not required body
      const producerEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.BOOLEAN
            }
          }
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Matching enum and string in request body', () => {
      const problemReport = new ProblemReporter();
      // client without body
      const clientEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.STRING
            }
          }
        ]
      } as Path;
      // producer with not required body
      const producerEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.ENUM
            }
          }
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    xit('do not ignore body when not required but is available', () => {
      const problemReport = new ProblemReporter();
      // client with body, but wrong schema type
      const clientEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.INTEGER
            }
          }
        ]
      } as Path;
      // producer with not required body
      const producerEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.BOOLEAN
            }
          }
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should has problems, because the schema types are not equals. This indicates that the body is checked
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    xit('Ignore Json Ignore property', () => {
      const problemReport = new ProblemReporter();
      // client with body, but wrong schema type
      const clientEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                name: {
                  type: SchemaTypes.STRING
                }
              }
            }
          }
        ]
      } as Path;
      // producer with not required body
      const producerEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                name: {
                  type: SchemaTypes.STRING,
                  mappings: {
                    json: {
                      ignore: true
                    }
                  }
                }
              }
            }
          }
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should has problems, because the schema types are not equals. This indicates that the body is checked
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('nested schema with correct types', () => {
      const problemReport = new ProblemReporter();
      // client with nested schema as body
      const clientEndpoint: Path = {
        parameters: [
          {
            required: true,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                "array": {
                  type: SchemaTypes.ARRAY,
                  items: {
                    type: SchemaTypes.INTEGER
                  } as Schema
                } as Schema,
                "object": {
                  type: SchemaTypes.OBJECT,
                  properties: {
                    'test': {
                      type: SchemaTypes.INTEGER
                    } as Schema
                  }
                } as Schema,
                "boolean": {
                  type: SchemaTypes.BOOLEAN
                } as Schema
              }
            } as Schema
          } as Parameter
        ]
      } as Path;
      // producer with the same schema as body
      const producerEndpoint: Path = {
        parameters: [
          {
            required: true,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                "array": {
                  type: SchemaTypes.ARRAY,
                  items: {
                    type: SchemaTypes.INTEGER
                  } as Schema
                } as Schema,
                "object": {
                  type: SchemaTypes.OBJECT,
                  properties: {
                    'test': {
                      type: SchemaTypes.INTEGER
                    } as Schema
                  }
                } as Schema,
                "boolean": {
                  type: SchemaTypes.BOOLEAN
                } as Schema
              }
            } as Schema
          } as Parameter
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // Shouldn't detect problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    xit('nested schema with incorrect object.boolean type', () => {
      const problemReport = new ProblemReporter();
      // client with nested schema as body
      const clientEndpoint: Path = {
        parameters: [
          {
            required: true,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                "boolean": {
                  type: SchemaTypes.INTEGER
                } as Schema
              }
            } as Schema
          } as Parameter
        ]
      } as Path;
      // producer with different type of nested object
      const producerEndpoint: Path = {
        parameters: [
          {
            required: true,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                "boolean": {
                  type: SchemaTypes.BOOLEAN
                } as Schema
              }
            } as Schema
          } as Parameter
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // Should detect
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    xit('Dont match case sensitive property in request body', () => {
      const problemReport = new ProblemReporter();
      // client without body
      const clientEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionchannelId: {
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        ]
      } as Path;
      // producer with not required body
      const producerEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('Ignore downstream check', () => {
      const problemReport = new ProblemReporter();
      // client without body
      const clientEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER,
                  mappings: {
                    client: {
                      ignore: true
                    }
                  }
                }
              }
            }
          }
        ]
      } as Path;
      // producer with not required body
      const producerEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
              }
            }
          }
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Map client name', () => {
      const problemReport = new ProblemReporter();
      // client without body
      const clientEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER,
                  mappings: {
                    client: {
                      name: 'resourceId'
                    }
                  }
                }
              }
            }
          }
        ]
      } as Path;
      // producer with not required body
      const producerEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                resourceId: {
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('AnyOf', () => {
      const problemReport = new ProblemReporter();
      // client without body
      const clientEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                },
                resourceId: {
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        ]
      } as Path;
      // producer with not required body
      const producerEndpoint: Path = {
        parameters: [
          {
            required: false,
            'in': 'body',
            name: 'body',
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                }
              },
              anyOf: [
                {
                  properties: {
                    resourceId: {
                      type: SchemaTypes.INTEGER
                    }
                  }
                }
              ]
            }
          }
        ]
      } as Path;

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).toBeFalsy();
    });
  });

  describe('#responseCheck', () => {
    it('No response bodies', () => {
      const problemReport = new ProblemReporter();

      // client with no response body
      const clientEndpoint: Path = {
      } as Path;

      // producer with no response body
      const producerEndpoint: Path = {

      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Not handled response body by client', () => {
      const problemReport = new ProblemReporter();

      // client dont handle response body
      const clientEndpoint: Path = {
      } as Path;

      // producer with response body
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.INTEGER
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Client handles response body when there is none', () => {
      const problemReport = new ProblemReporter();

      // client expect response body
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.INTEGER
            }
          }
        }
      } as Path;

      // producer has no response body
      const producerEndpoint: Path = {
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    xit('Client has wrong response body', () => {
      const problemReport = new ProblemReporter();

      // client expect response body
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.INTEGER
            }
          }
        }
      } as Path;

      // producer has no response body
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.BOOLEAN
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    xit('Dont match case sensitive property in response body', () => {
      const problemReport = new ProblemReporter();

      // client
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionchannelId: {
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        }
      } as Path;

      // producer
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('Match inherit producer property', () => {
      const problemReport = new ProblemReporter();

      // client
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                },
                parentId: {
                  required: true,
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        }
      } as Path;

      // producer
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                }
              },
              allOf: [{
                $ref: "#/ParentObject"
              }]
            }
          }
        }
      } as Path;
      const producerProject = {
        ParentObject: {
          type: SchemaTypes.OBJECT,
          properties: {
            parentId: {
              type: SchemaTypes.INTEGER
            }
          }
        }
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, producerProject, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Match inherit client property', () => {
      const problemReport = new ProblemReporter();

      // client
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                }
              },
              allOf: [{
                $ref: "#/ParentObject"
              }]
            }
          }
        }
      } as Path;
      const clientProject = {
        ParentObject: {
          type: SchemaTypes.OBJECT,
          properties: {
            parentId: {
              type: SchemaTypes.INTEGER
            }
          }
        }
      };

      // producer
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                },
                parentId: {
                  required: true,
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, clientProject, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    xit('Producer missing a property', () => {
      const problemReport = new ProblemReporter();

      // client expect response body
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                "test1": {
                  type: SchemaTypes.STRING
                }
              }
            }
          }
        }
      } as Path;

      // producer has no response body
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                "test2": {
                  type: SchemaTypes.STRING,
                  required: true
                }
              }
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('Matching enum and string in response body', () => {
      const problemReport = new ProblemReporter();

      // client expect response body
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.STRING
            }
          }
        }
      } as Path;

      // producer has no response body
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.ENUM
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    it('Ignore downstream check', () => {
      const problemReport = new ProblemReporter();

      // client expect response body
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER,
                  mappings: {
                    client: {
                      ignore: true
                    }
                  }
                }
              }
            }
          }
        }
      } as Path;

      // producer has no response body
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {}
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });

    xit('Map json name', () => {
      const problemReport = new ProblemReporter();

      // client expect response body
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER,
                  mappings: {
                    json: {
                      name: 'resourceId'
                    }
                  }
                }
              }
            }
          }
        }
      } as Path;

      // producer has no response body
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    xit('Map client name', () => {
      const problemReport = new ProblemReporter();

      // client expect response body
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER,
                  mappings: {
                    client: {
                      name: 'resourceId'
                    }
                  }
                }
              }
            }
          }
        }
      } as Path;

      // producer has no response body
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeTruthy();
    });

    it('AnyOf', () => {
      const problemReport = new ProblemReporter();

      // client expect response body
      const clientEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                },
                resourceId: {
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        }
      } as Path;

      // producer has no response body
      const producerEndpoint: Path = {
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {
                distributionChannelId: {
                  type: SchemaTypes.INTEGER
                }
              },
              anyOf: [
                {
                  type: SchemaTypes.OBJECT,
                  properties: {
                    resourceId: {
                      type: SchemaTypes.INTEGER
                    }
                  }
                }
              ]
            }
          }
        }
      } as Path;

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).toBeFalsy();
    });
  });

});
