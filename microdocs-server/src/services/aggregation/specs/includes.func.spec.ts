import { Project, DependencyTypes, ProblemLevels } from "@maxxton/microdocs-core/dist/domain";
import { combineIncludes } from "../funcs/includes.func";
import { PipeMock } from "./mocks/pipe-mock.mock";


describe( '#Aggregation: #combineIncludes:', () => {

  it( '#Error when missing dependent project', () => {
    const pipeMock        = new PipeMock( {} );
    const project: Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES
        }
      }
    };

    combineIncludes( pipeMock, project );

    expect([ {
      level: ProblemLevels.ERROR,
      message: "Unknown project: test-project"
    } ]).toEqual(project.dependencies[ 'test-project' ].problems );
  } );

  it( '#Find latest dependent project', () => {
    const pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': { info: { version: '1.0.0' } } as Project,
        '2.0.0': { info: { version: '2.0.0' } } as Project
      }
    } );
    const project: Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES
        }
      }
    };

    combineIncludes( pipeMock, project );

    expect( project.dependencies[ 'test-project' ].version).toEqual( '2.0.0' );
  } );

  it( '#Find defined version', () => {
    const pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': { info: { version: '1.0.0' } } as Project,
        '2.0.0': { info: { version: '2.0.0' } } as Project
      }
    } );
    const project: Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES,
          version: '1.0.0'
        }
      }
    };

    combineIncludes( pipeMock, project );

    expect( project.dependencies[ 'test-project' ].version).toEqual( '1.0.0' );
  } );

  it( '#Find not deprecated version', () => {
    const pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': { info: { version: '1.0.0' } } as Project,
        '2.0.0': { info: { version: '2.0.0' }, deprecated: true } as Project,
        '3.0.0': { info: { version: '3.0.0' } } as Project
      }
    } );
    const project: Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES,
          version: '2.0.0'
        }
      }
    };

    combineIncludes( pipeMock, project );

    expect( project.dependencies[ 'test-project' ].version).toEqual( '1.0.0' );
  } );

  it( '#Resolve chained include dependency', () => {
    const pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': {
          info: { version: '1.0.0', title: 'test-project' },
          dependencies: {
            'test2-project': {
              type: DependencyTypes.INCLUDES
            }
          }
        } as any
      },
      'test2-project': {
        '1.0.0': { info: { version: '1.0.0', title: 'test-project' } } as Project
      }
    } );
    const project: Project = {
      dependencies: {
        'test-project': {
          type: DependencyTypes.INCLUDES,
          version: '2.0.0'
        }
      }
    };

    combineIncludes( pipeMock, project );

    expect( pipeMock._store['test-project']['1.0.0'].dependencies['test2-project'].version).toEqual( '1.0.0' );
  } );

  it( '#Merge components', () => {
    const pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': {
          info: { version: '1.0.0', title: 'test-project' },
          components: {
            TestService: {
              name: 'TestService',
              methods: {
                hello: {}
              }
            }
          }
        } as any
      }
    } );
    const project: Project = {
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

    expect( project.components['TestService'].methods).toEqual( {hello: {}, bye: {}} );
  } );

  it( '#Merge definitions', () => {
    const pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': {
          info: { version: '1.0.0', title: 'test-project' },
          definitions: {
            Task: {
              name: 'Task',
              properties: {
                'hello': {}
              }
            }
          }
        } as any
      }
    } );
    const project: Project = {
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

    expect( project.definitions['Task'].properties).toEqual( {hello: {}, bye: {}} );
  } );

  it( '#Merge dependencies', () => {
    const pipeMock        = new PipeMock( {
      'test-project': {
        '1.0.0': {
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
        } as any
      }
    } );
    const project: Project = {
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

    expect( project.dependencies).toEqual( {
      'test-project' : {
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

