import {expect} from 'chai';
import { ProblemReporter } from "@maxxton/microdocs-core/helpers";
import { Path, SchemaTypes, Parameter, Schema } from "@maxxton/microdocs-core/domain";
import { checkQueryParameters,checkPathParameters,checkBodyParameters, checkResponseBody } from "../funcs";

describe('#Aggregation: #endpointCheck:', () => {

  describe('#queryCheck', () => {

    it('No query parameters', () => {
      var problemReport = new ProblemReporter();

      // client with no query parameters
      var clientEndpoint: Path = <Path>{
        parameters: []
      };

      // producer with no query parameters
      var producerEndpoint: Path = <Path>{
        parameters: []
      };

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Missing query parameters', () => {
      var problemReport = new ProblemReporter();

      // client with no query parameters
      var clientEndpoint: Path = <Path>{
        parameters: []
      };

      // producer with no query parameters
      var producerEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search'
          }
        ]
      };

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Missing required query parameters', () => {
      var problemReport = new ProblemReporter();

      // client with no query parameters
      var clientEndpoint: Path = <Path>{
        parameters: []
      };

      // producer with no query parameters
      var producerEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            required: true
          }
        ]
      };

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Matching query types', () => {
      var problemReport = new ProblemReporter();

      // client with string query param
      var clientEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true
          }
        ]
      };

      // producer with same query param
      var producerEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true
          }
        ]
      };

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Mismatching query types', () => {
      var problemReport = new ProblemReporter();

      // client with string query param
      var clientEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true
          }
        ]
      };

      // producer with same query param
      var producerEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'number',
            required: true
          }
        ]
      };

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Matching enum query type', () => {
      var problemReport = new ProblemReporter();

      // client with string query param
      var clientEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true,
            default: 'application',
          }
        ]
      };

      // producer with same query param
      var producerEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'enum',
            required: true,
            'enum': ['application']
          }
        ]
      };

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Matching reverse enum query type', () => {
      var problemReport = new ProblemReporter();

      // client with string query param
      var clientEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'enum',
            required: true,
            'enum': ['application']
          }
        ]
      };

      // producer with same query param
      var producerEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string',
            required: true,
            default: 'application',
          }
        ]
      };

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Matching any query type', () => {
      var problemReport = new ProblemReporter();

      // client with string query param
      var clientEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'any',
            required: true
          }
        ]
      };

      // producer with same query param
      var producerEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'number',
            required: true
          }
        ]
      };

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Mismatching not required query types', () => {
      var problemReport = new ProblemReporter();

      // client with string query param
      var clientEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'string'
          }
        ]
      };

      // producer with same query param
      var producerEndpoint: Path = <Path>{
        parameters: [
          {
            'in': 'query',
            name: 'search',
            type: 'number',
            required: false
          }
        ]
      };

      // act
      checkQueryParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.true;
    });
  });

  describe('#pathCheck', () => {
    it('No path parameters', () => {
      var problemReport = new ProblemReporter();

      // client with no path parameters
      var clientEndpoint: Path = <Path>{
        path: '/api/v1/something'
      };

      // producer with no path parameters
      var producerEndpoint: Path = <Path>{
        path: '/api/v1/something'
      };

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Client with path parameter', () => {
      var problemReport = new ProblemReporter();

      // client with path parameter
      var clientEndpoint: Path = <Path>{
        path: '/api/v1/{param}'
      };

      // producer with no path parameters
      var producerEndpoint: Path = <Path>{
        path: '/api/v1/something'
      };

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Producer with path parameter', () => {
      var problemReport = new ProblemReporter();

      // client with path parameter
      var clientEndpoint: Path = <Path>{
        path: '/api/v1/something'
      };

      // producer with no path parameters
      var producerEndpoint: Path = <Path>{
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.STRING,
            required: true
          }
        ]
      };

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Same type path parameter', () => {
      var problemReport = new ProblemReporter();

      // client with path parameter
      var clientEndpoint: Path = <Path>{
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.INTEGER,
            required: true
          }
        ]
      };

      // producer with no path parameters
      var producerEndpoint: Path = <Path>{
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.INTEGER,
            required: true
          }
        ]
      };

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Mismatch type path parameter', () => {
      var problemReport = new ProblemReporter();

      // client with path parameter
      var clientEndpoint: Path = <Path>{
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.INTEGER,
            required: true
          }
        ]
      };

      // producer with no path parameters
      var producerEndpoint: Path = <Path>{
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.BOOLEAN,
            required: true
          }
        ]
      };

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Client param not found', () => {
      var problemReport = new ProblemReporter();

      // client with path parameter
      var clientEndpoint: Path = <Path>{
        path: '/api/v1/{param}'
      };

      // producer with no path parameters
      var producerEndpoint: Path = <Path>{
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.BOOLEAN,
            required: true
          }
        ]
      };

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Producer param not found', () => {
      var problemReport = new ProblemReporter();

      // client with path parameter
      var clientEndpoint: Path = <Path>{
        path: '/api/v1/{param}',
        parameters: [
          {
            'in': 'path',
            name: 'param',
            type: SchemaTypes.BOOLEAN,
            required: true
          }
        ]
      };

      // producer with no path parameters
      var producerEndpoint: Path = <Path>{
        path: '/api/v1/{param}'
      };

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Client with number instead of param', () => {
      var problemReport = new ProblemReporter();

      // client with path parameter
      var clientEndpoint: Path = <Path>{
        path: '/api/v1/5'
      };

      // producer with no path parameters
      var producerEndpoint: Path = <Path>{
        path: '/api/v1/{param}',
        parameters: [
          {
            name: 'param',
            'in': 'path',
            type: SchemaTypes.NUMBER,
            required: true
          }
        ]
      };

      // act
      checkPathParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });
  });

  describe('#bodyCheck', () => {
    it('ignore body when not required', () => {
      var problemReport = new ProblemReporter();
      //client without body
      var clientEndpoint: Path = <Path>{
        parameters: []
      };
      //producer with not required body
      var producerEndpoint: Path = <Path>{
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
      };

      //act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).be.false;
    });

    it('Matching enum and string in request body', () => {
      var problemReport = new ProblemReporter();
      //client without body
      var clientEndpoint: Path = <Path>{
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
      };
      //producer with not required body
      var producerEndpoint: Path = <Path>{
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
      };

      //act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).be.false;
    });

    it('do not ignore body when not required but is available', () => {
      var problemReport = new ProblemReporter();
      //client with body, but wrong schema type
      var clientEndpoint: Path = <Path>{
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
      };
      //producer with not required body
      var producerEndpoint: Path = <Path>{
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
      };

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should has problems, because the schema types are not equals. This indicates that the body is checked
      expect(problemReport.hasProblems()).be.true;
    });

    it('Ignore Json Ignore property', () => {
      var problemReport = new ProblemReporter();
      //client with body, but wrong schema type
      var clientEndpoint: Path = <Path>{
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
      };
      //producer with not required body
      var producerEndpoint: Path = <Path>{
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
      };

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should has problems, because the schema types are not equals. This indicates that the body is checked
      expect(problemReport.hasProblems()).be.true;
    });

    it('nested schema with correct types', () => {
      var problemReport = new ProblemReporter();
      //client with nested schema as body
      var clientEndpoint: Path = <Path>{
        parameters: [
          <Parameter>{
            required: true,
            'in': 'body',
            name: 'body',
            schema: <Schema>{
              type: SchemaTypes.OBJECT,
              properties: {
                "array": <Schema>{
                  type: SchemaTypes.ARRAY,
                  items: <Schema>{
                    type: SchemaTypes.INTEGER
                  }
                },
                "object": <Schema>{
                  type: SchemaTypes.OBJECT,
                  properties: {
                    'test': <Schema>{
                      type: SchemaTypes.INTEGER
                    }
                  }
                },
                "boolean": <Schema>{
                  type: SchemaTypes.BOOLEAN
                }
              }
            }
          }
        ]
      };
      //producer with the same schema as body
      var producerEndpoint: Path = <Path>{
        parameters: [
          <Parameter>{
            required: true,
            'in': 'body',
            name: 'body',
            schema: <Schema>{
              type: SchemaTypes.OBJECT,
              properties: {
                "array": <Schema>{
                  type: SchemaTypes.ARRAY,
                  items: <Schema>{
                    type: SchemaTypes.INTEGER
                  }
                },
                "object": <Schema>{
                  type: SchemaTypes.OBJECT,
                  properties: {
                    'test': <Schema>{
                      type: SchemaTypes.INTEGER
                    }
                  }
                },
                "boolean": <Schema>{
                  type: SchemaTypes.BOOLEAN
                }
              }
            }
          }
        ]
      };

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // Shouldn't detect problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('nested schema with incorrect object.boolean type', () => {
      var problemReport = new ProblemReporter();
      //client with nested schema as body
      var clientEndpoint: Path = <Path>{
        parameters: [
          <Parameter>{
            required: true,
            'in': 'body',
            name: 'body',
            schema: <Schema>{
              type: SchemaTypes.OBJECT,
              properties: {
                "boolean": <Schema>{
                  type: SchemaTypes.INTEGER
                }
              }
            }
          }
        ]
      };
      //producer with different type of nested object
      var producerEndpoint: Path = <Path>{
        parameters: [
          <Parameter>{
            required: true,
            'in': 'body',
            name: 'body',
            schema: <Schema>{
              type: SchemaTypes.OBJECT,
              properties: {
                "boolean": <Schema>{
                  type: SchemaTypes.BOOLEAN
                }
              }
            }
          }
        ]
      };

      // act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // Should detect
      expect(problemReport.hasProblems()).be.true;
    });

    it('Dont match case sensitive property in request body', () => {
      var problemReport = new ProblemReporter();
      //client without body
      var clientEndpoint: Path = <Path>{
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
      };
      //producer with not required body
      var producerEndpoint: Path = <Path>{
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
      };

      //act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).be.true;
    });

    it('Ignore downstream check', () => {
      var problemReport = new ProblemReporter();
      //client without body
      var clientEndpoint: Path = <Path>{
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
      };
      //producer with not required body
      var producerEndpoint: Path = <Path>{
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
      };

      //act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).be.false;
    });

    it('Map client name', () => {
      var problemReport = new ProblemReporter();
      //client without body
      var clientEndpoint: Path = <Path>{
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
      };
      //producer with not required body
      var producerEndpoint: Path = <Path>{
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
      };

      //act
      checkBodyParameters(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // no problems expected, as the body is not required
      expect(problemReport.hasProblems()).be.false;
    });
  });

  describe('#responseCheck', () => {
    it('No response bodies', () => {
      var problemReport = new ProblemReporter();

      // client with no response body
      var clientEndpoint: Path = <Path>{
      };

      // producer with no response body
      var producerEndpoint: Path = <Path>{

      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Not handled response body by client', () => {
      var problemReport = new ProblemReporter();

      // client dont handle response body
      var clientEndpoint: Path = <Path>{
      };

      // producer with response body
      var producerEndpoint: Path = <Path>{
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.INTEGER
            }
          }
        }
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // No problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Client handles response body when there is none', () => {
      var problemReport = new ProblemReporter();

      // client expect response body
      var clientEndpoint: Path = <Path>{
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.INTEGER
            }
          }
        }
      };

      // producer has no response body
      var producerEndpoint: Path = <Path>{
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Client has wrong response body', () => {
      var problemReport = new ProblemReporter();

      // client expect response body
      var clientEndpoint: Path = <Path>{
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.INTEGER
            }
          }
        }
      };

      // producer has no response body
      var producerEndpoint: Path = <Path>{
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.BOOLEAN
            }
          }
        }
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Dont match case sensitive property in response body', () => {
      var problemReport = new ProblemReporter();

      // client
      var clientEndpoint: Path = <Path>{
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
      };

      // producer
      var producerEndpoint: Path = <Path>{
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
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Match inherit producer property', () => {
      var problemReport = new ProblemReporter();

      // client
      var clientEndpoint: Path = <Path>{
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
      };

      // producer
      var producerEndpoint: Path = <Path>{
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
      };
      var producerProject = {
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
      expect(problemReport.hasProblems()).be.false;
    });

    it('Match inherit client property', () => {
      var problemReport = new ProblemReporter();

      // client
      var clientEndpoint: Path = <Path>{
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
      };
      var clientProject = {
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
      var producerEndpoint: Path = <Path>{
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
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, clientProject, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Producer missing a property', () => {
      var problemReport = new ProblemReporter();

      // client expect response body
      var clientEndpoint: Path = <Path>{
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
      };

      // producer has no response body
      var producerEndpoint: Path = <Path>{
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
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Matching enum and string in response body', () => {
      var problemReport = new ProblemReporter();

      // client expect response body
      var clientEndpoint: Path = <Path>{
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.STRING
            }
          }
        }
      };

      // producer has no response body
      var producerEndpoint: Path = <Path>{
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.ENUM
            }
          }
        }
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Ignore downstream check', () => {
      var problemReport = new ProblemReporter();

      // client expect response body
      var clientEndpoint: Path = <Path>{
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
      };

      // producer has no response body
      var producerEndpoint: Path = <Path>{
        responses: {
          "default": {
            schema: {
              type: SchemaTypes.OBJECT,
              properties: {}
            }
          }
        }
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).be.false;
    });

    it('Map json name', () => {
      var problemReport = new ProblemReporter();

      // client expect response body
      var clientEndpoint: Path = <Path>{
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
      };

      // producer has no response body
      var producerEndpoint: Path = <Path>{
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
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).be.true;
    });

    it('Map client name', () => {
      var problemReport = new ProblemReporter();

      // client expect response body
      var clientEndpoint: Path = <Path>{
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
      };

      // producer has no response body
      var producerEndpoint: Path = <Path>{
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
      };

      // act
      checkResponseBody(clientEndpoint, producerEndpoint, {}, {}, problemReport);

      // should give problems
      expect(problemReport.hasProblems()).be.true;
    });
  });

});