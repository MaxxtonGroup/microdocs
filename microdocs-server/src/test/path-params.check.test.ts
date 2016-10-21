/// <reference path="../../typings/index.d.ts" />
import {expect} from 'chai';
import {ProblemReporter, SchemaHelper} from "@maxxton/microdocs-core-ts/dist/helpers";
import {Path, Parameter, Schema} from "@maxxton/microdocs-core-ts/dist/domain";
import {STRING, INTEGER, BOOLEAN} from "@maxxton/microdocs-core-ts/dist/domain/schema/schema-type.model";

import {PathParamsCheck} from "../checks/path-params.check";

describe('#path-params check:', () => {

  var pathParamCheck: PathParamsCheck;

  beforeEach(function () {
    pathParamCheck = new PathParamsCheck();
  });

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
    pathParamCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
    pathParamCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
      path: '/api/v1/{param}'
    };

    // act
    pathParamCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
          type: INTEGER,
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
          type: INTEGER,
          required: true
        }
      ]
    };

    // act
    pathParamCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
          type: INTEGER,
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
          type: BOOLEAN,
          required: true
        }
      ]
    };

    // act
    pathParamCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
          type: BOOLEAN,
          required: true
        }
      ]
    };

    // act
    pathParamCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
          type: BOOLEAN,
          required: true
        }
      ]
    };

    // producer with no path parameters
    var producerEndpoint: Path = <Path>{
      path: '/api/v1/{param}'
    };

    // act
    pathParamCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

    // No problems
    expect(problemReport.hasProblems()).be.true;
  });
});