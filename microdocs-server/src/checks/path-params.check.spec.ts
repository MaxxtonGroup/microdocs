/// <reference path="../../typings/index.d.ts" />
import {expect} from 'chai';
import {ProblemReporter} from "@maxxton/microdocs-core/helpers";
import {Path, SchemaTypes} from "@maxxton/microdocs-core/domain";

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
          type: SchemaTypes.BOOLEAN,
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
    pathParamCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
    pathParamCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

    // No problems
    expect(problemReport.hasProblems()).be.false;
  });
});