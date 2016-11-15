/// <reference path="../../../../typings/index.d.ts" />
import { assert } from 'chai';
import { Project, DependencyTypes, ProblemLevels } from "@maxxton/microdocs-core/domain";
import { combineIncludes } from "../funcs/includes.func";
import { PipeMock } from "./pipe-mock.spec";


describe( '#Aggregation: #combineIncludes:', () => {

  it( '#Error when missing dependent project', () => {
    let pipeMock        = new PipeMock( {} );
    let project:Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES
        }
      }
    };

    combineIncludes( pipeMock, project );

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
          type: DependencyTypes.INCLUDES
        }
      }
    };

    combineIncludes( pipeMock, project );

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
          type: DependencyTypes.INCLUDES,
          version: '1.0.0'
        }
      }
    };

    combineIncludes( pipeMock, project );

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
          type: DependencyTypes.INCLUDES,
          version: '2.0.0'
        }
      }
    };

    combineIncludes( pipeMock, project );

    assert.deepEqual( project.dependencies[ 'test-project' ].version, '1.0.0' );
  } );

  it( '#Resolve chained include dependency', () => {
    let pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{
          info: { version: '1.0.0', title: 'test-project' },
          dependencies: {
            'test2-project': {
              type: DependencyTypes.INCLUDES
            }
          }
        }
      },
      'test2-project': {
        '1.0.0': <Project>{ info: { version: '1.0.0', title: 'test-project' } }
      }
    } );
    let project:Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES,
          version: '2.0.0'
        }
      }
    };

    combineIncludes( pipeMock, project );

    assert.deepEqual( pipeMock._store['test-project']['1.0.0'].dependencies['test2-project'].version, '1.0.0' );
  } );

  it( '#Merge components', () => {
    let pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{
          info: { version: '1.0.0', title: 'test-project' },
          components: {
            TestService: {
              name: 'TestService',
              methods: {
                hello: {}
              }
            }
          }
        }
      }
    } );
    let project:Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES,
          version: '2.0.0'
        }
      },
      components: {
        TestService: {
          name: 'TestService',
          methods: {
            bye: {}
          }
        }
      }
    };

    combineIncludes( pipeMock, project );

    assert.deepEqual( project.components['TestService'].methods, {hello:{},bye:{}} );
  } );

  it( '#Merge definitions', () => {
    let pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{
          info: { version: '1.0.0', title: 'test-project' },
          definitions: {
            Task: {
              name: 'Task',
              properties: {
                'hello': {}
              }
            }
          }
        }
      }
    } );
    let project:Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES,
          version: '2.0.0'
        }
      },
      definitions: {
        Task: {
          name: 'Task',
          properties: {
            'bye': {}
          }
        }
      }
    };

    combineIncludes( pipeMock, project );

    assert.deepEqual( project.definitions['Task'].properties, {hello:{},bye:{}} );
  } );

  it( '#Merge dependencies', () => {
    let pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{
          info: { version: '1.0.0', title: 'test-project' },
          dependencies: {
            'dep1': {
              type: DependencyTypes.REST,
              paths: {
                'bye': {}
              }
            },
            'dep2': {
              type: DependencyTypes.REST
            }
          }
        }
      }
    } );
    let project:Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES,
          version: '2.0.0'
        },
        'dep1': {
          type: DependencyTypes.REST,
          paths: {
            'hello': {}
          }
        }
      }
    };

    combineIncludes( pipeMock, project );

    assert.deepEqual( project.dependencies, {
      'test-project' :{
        type: DependencyTypes.INCLUDES,
        version: '1.0.0'
      },
      'dep1': {
        type: DependencyTypes.REST,
        paths: {
          'hello': {},
          'bye': {}
        }
      },
      'dep2': {
        type: DependencyTypes.REST,
        inherit: true
      }
    } );
  } );


} );

