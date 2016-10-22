/// <reference path="../../typings/index.d.ts" />
import {expect} from 'chai';
import {ProblemReporter, SchemaHelper} from "@maxxton/microdocs-core-ts/dist/helpers";
import {Path, Parameter, Schema} from "@maxxton/microdocs-core-ts/dist/domain";
import {STRING, INTEGER, BOOLEAN} from "@maxxton/microdocs-core-ts/dist/domain/schema/schema-type.model";

import {QueryParamsCheck} from "../checks/query-params.check";

describe('#query-params check:', () => {

  var queryParamsCheck: QueryParamsCheck;

  beforeEach(function () {
    queryParamsCheck = new QueryParamsCheck();
  });

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
    queryParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
    queryParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
    queryParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
    queryParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

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
    queryParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

    // No problems
    expect(problemReport.hasProblems()).be.true;
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
    queryParamsCheck.check(clientEndpoint, producerEndpoint, {}, problemReport);

    // No problems
    expect(problemReport.hasProblems()).be.true;
  });

});