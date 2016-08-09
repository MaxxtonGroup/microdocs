/// <reference path="../../typings/index.d.ts" />
import {expect} from 'chai';
import {ProblemReporter, SchemaHelper} from "microdocs-core-ts/dist/helpers";
import {Path, Parameter, Schema} from "microdocs-core-ts/dist/domain";
import {STRING, INTEGER, BOOLEAN, OBJECT} from "microdocs-core-ts/dist/domain/schema/schema-type.model";

import {ResponseCheck} from "../checks/response.check";

describe('#response check:', () => {

  var responseCheck: ResponseCheck;

  beforeEach(function () {
    responseCheck = new ResponseCheck();
  });

  it('No response bodies', () => {
    var problemReport = new ProblemReporter();

    // client with no response body
    var clientEndpoint: Path = <Path>{
    };

    // producer with no response body
    var producerEndpoint: Path = <Path>{

    };

    // act
    responseCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
            type: INTEGER
          }
        }
      }
    };

    // act
    responseCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
            type: INTEGER
          }
        }
      }
    };

    // producer has no response body
    var producerEndpoint: Path = <Path>{
    };

    // act
    responseCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
            type: INTEGER
          }
        }
      }
    };

    // producer has no response body
    var producerEndpoint: Path = <Path>{
      responses: {
        "default": {
          schema: {
            type: BOOLEAN
          }
        }
      }
    };

    // act
    responseCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

    // should give problems
    expect(problemReport.hasProblems()).be.true;
  });

  it('Producer missing a property', () => {
    var problemReport = new ProblemReporter();

    // client expect response body
    var clientEndpoint: Path = <Path>{
      responses: {
        "default": {
          schema: {
            type: OBJECT,
            properties: {
              "test1": {
                type: STRING,
                required: true
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
            type: OBJECT,
            properties: {
              "test2": {
                type: STRING
              }
            }
          }
        }
      }
    };

    // act
    responseCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

    // should give problems
    expect(problemReport.hasProblems()).be.true;
  });
});