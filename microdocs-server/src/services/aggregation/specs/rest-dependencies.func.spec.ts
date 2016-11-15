/// <reference path="../../../../typings/index.d.ts" />
import { assert } from 'chai';
import { Project, DependencyTypes, ProblemLevels, ProjectInfo } from "@maxxton/microdocs-core/domain";
import { PipeMock } from "./pipe-mock.spec";
import { resolveRestDependencies } from "../funcs/rest-dependencies.func";


describe( '#Aggregation: #resolveRestDependencies:', () => {

  it( '#Error when missing dependent project', () => {
    let pipeMock        = new PipeMock( {} );
    let project:Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST
        }
      }
    };

    resolveRestDependencies( pipeMock, project );

    assert.deepEqual( [ {
      level: ProblemLevels.ERROR,
      message: "Unknown project: test-project"
    } ], project.dependencies[ 'test-project' ].problems );
  } );

  it( '#Find latest dependent project', () => {
    let pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{ info: { version: '1.0.0' } },
        '2.0.0': <Project>{ info: { version: '2.0.0' } }
      }
    } );
    let project:Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST
        }
      }
    };

    resolveRestDependencies( pipeMock, project );

    assert.deepEqual( project.dependencies[ 'test-project' ].version, '2.0.0' );
  } );

  it( '#Find defined version', () => {
    let pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{ info: { version: '1.0.0' } },
        '2.0.0': <Project>{ info: { version: '2.0.0' } }
      }
    } );
    let project:Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST,
          version: '1.0.0'
        }
      }
    };

    resolveRestDependencies( pipeMock, project );

    assert.deepEqual( project.dependencies[ 'test-project' ].version, '1.0.0' );
  } );

  it( '#Find not deprecated version', () => {
    let pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{ info: { version: '1.0.0' } },
        '2.0.0': <Project>{ info: { version: '2.0.0' }, deprecated: true },
        '3.0.0': <Project>{ info: { version: '3.0.0' } }
      }
    } );
    let project:Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST,
          version: '2.0.0'
        }
      }
    };

    resolveRestDependencies( pipeMock, project );

    assert.deepEqual( project.dependencies[ 'test-project' ].version, '1.0.0' );
  } );

  describe("#checkDependencyCompatible", () => {
    it( '#Find not deprecated version', () => {
      //todo: make this test
      let pipeMock        = new PipeMock( {
        'test-project': {
          '1.0.0': <Project>{ info: { version: '1.0.0' } },
          '2.0.0': <Project>{ info: { version: '2.0.0' }, deprecated: true },
          '3.0.0': <Project>{ info: { version: '3.0.0' } }
        }
      } );
      let project:Project = {
        dependencies: {
          'test-project': {
            type: DependencyTypes.REST,
            version: '2.0.0'
          }
        }
      };

      resolveRestDependencies( pipeMock, project );

      assert.deepEqual( project.dependencies[ 'test-project' ].version, '1.0.0' );
    } );
  });



});