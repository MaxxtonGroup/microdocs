/// <reference path="../../typings/index.d.ts" />
import {expect} from 'chai';
import {ProblemReporter, SchemaHelper} from "@maxxton/microdocs-core/helpers";
import {Path, Parameter, Schema} from "@maxxton/microdocs-core/domain";
import {OBJECT, INTEGER, BOOLEAN, ARRAY} from "@maxxton/microdocs-core/domain/schema/schema-type.model";

import {BodyParamsCheck} from "../checks/body-params.check";

describe('#body-params check:', () => {

  var bodyParamsCheck: BodyParamsCheck;

  beforeEach(function () {
    bodyParamsCheck = new BodyParamsCheck();
  });

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
            type: BOOLEAN
          }
        }
      ]
    };

    //act
    bodyParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
            type: INTEGER
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
            type: BOOLEAN
          }
        }
      ]
    };

    // act
    bodyParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
            type: OBJECT,
            properties: {
              "array": <Schema>{
                type: ARRAY,
                items: <Schema>{
                  type: INTEGER
                }
              },
              "object": <Schema>{
                type: OBJECT,
                properties: {
                  'test': <Schema>{
                    type: INTEGER
                  }
                }
              },
              "boolean": <Schema>{
                type: BOOLEAN
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
            type: OBJECT,
            properties: {
              "array": <Schema>{
                type: ARRAY,
                items: <Schema>{
                  type: INTEGER
                }
              },
              "object": <Schema>{
                type: OBJECT,
                properties: {
                  'test': <Schema>{
                    type: INTEGER
                  }
                }
              },
              "boolean": <Schema>{
                type: BOOLEAN
              }
            }
          }
        }
      ]
    };

    // act
    bodyParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
            type: OBJECT,
            properties: {
              "boolean": <Schema>{
                type: INTEGER
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
            type: OBJECT,
            properties: {
              "boolean": <Schema>{
                type: BOOLEAN
              }
            }
          }
        }
      ]
    };

    // act
    bodyParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

    // Should detect
    expect(problemReport.hasProblems()).be.true;
  });
});