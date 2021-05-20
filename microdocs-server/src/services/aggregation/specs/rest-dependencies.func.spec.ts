
import { Project, DependencyTypes, ProblemLevels, ProjectInfo, SchemaTypes } from "@maxxton/microdocs-core/dist/domain";
import { PipeMock } from "./mocks/pipe-mock.mock";
import { resolveRestDependencies } from "../funcs/rest-dependencies.func";


describe( '#Aggregation: #resolveRestDependencies:', () => {

  it( '#Error when missing dependent project', () => {
    const pipeMock         = new PipeMock( {} );
    const project: Project = {
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST
        }
      }
    } as Project;

    resolveRestDependencies( pipeMock, project );

    expect( [ {
      level: ProblemLevels.ERROR,
      message: "Unknown project: test-project"
    } ]).toEqual( project.dependencies[ 'test-project' ].problems );
  } );

  it( '#Find latest dependent project', () => {
    const pipeMock         = new PipeMock( {
      'test-project': {
        '1.0.0': { info: new ProjectInfo( 'test-project', 'test-group', '1.0.0', [ '1.0.0', '2.0.0' ] ) } as Project,
        '2.0.0': { info: new ProjectInfo( 'test-project', 'test-group', '2.0.0', [ '1.0.0', '2.0.0' ] ) } as Project
      }
    } );
    const project: Project = {
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST
        }
      }
    } as Project;

    resolveRestDependencies( pipeMock, project );

    expect( project.dependencies[ 'test-project' ].version).toEqual( '2.0.0' );
  } );

  it( '#Find defined version', () => {
    const pipeMock         = new PipeMock( {
      'test-project': {
        '1.0.0': { info: new ProjectInfo( 'test-project', 'test-group', '1.0.0', [ '1.0.0', '2.0.0' ] ) } as Project,
        '2.0.0': { info: new ProjectInfo( 'test-project', 'test-group', '2.0.0', [ '1.0.0', '2.0.0' ] ) } as Project
      }
    } );
    const project: Project = {
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST,
          version: '1.0.0'
        }
      }
    } as Project;

    resolveRestDependencies( pipeMock, project );

    expect( project.dependencies[ 'test-project' ].version).toEqual( '1.0.0' );
  } );

  it( '#Find not deprecated version', () => {
    const pipeMock         = new PipeMock( {
      'test-project': {
        '1.0.0': { info: new ProjectInfo( 'test-project', 'test-group', '1.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) } as Project,
        '2.0.0': {
          info: new ProjectInfo( 'test-project', 'test-group', '2.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ),
          deprecated: true
        } as Project,
        '3.0.0': { info: new ProjectInfo( 'test-project', 'test-group', '3.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) } as Project
      }
    } );
    const project: Project = {
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST,
          version: '2.0.0'
        }
      }
    } as Project;

    resolveRestDependencies( pipeMock, project );

    expect( project.dependencies[ 'test-project' ].version).toEqual( '2.0.0' );
    expect( project.dependencies[ 'test-project' ].problems.length).toEqual( 1 );
  } );

  it( '#Find not dependency deprecated version', () => {
    const pipeMock         = new PipeMock( {
      'test-project': {
        '1.0.0': { info: new ProjectInfo( 'test-project', 'test-group', '1.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) } as Project,
        '2.0.0': { info: new ProjectInfo( 'test-project', 'test-group', '2.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) } as Project,
        '3.0.0': { info: new ProjectInfo( 'test-project', 'test-group', '3.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) } as Project
      }
    } );
    const project: Project = {
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST,
          deprecatedVersions: [ '3.0.0', '2.0.0' ]
        }
      }
    } as Project;

    resolveRestDependencies( pipeMock, project );

    expect( project.dependencies[ 'test-project' ].version).toEqual( '1.0.0' );
  } );


  describe( "#checkEndpoints", () => {

    /**
     * producer: GET /api/v1/test
     * consumer: GET /api/v1/test
     * result: match
     */
    it( "Match same paths", () => {
      // Arrange
      const pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': {
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/test": {
                get: {}
              }
            }
          } as Project
        }
      } );
      const project: Project = {
        info: new ProjectInfo( 'order-project', 'group3', '3.0.0', [ '3.0.0', '2.0.0', '1.0.0' ] ),
        dependencies: {
          'test-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/test": {
                get: {}
              }
            }
          }
        }
      } as Project;

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      expect( project.dependencies[ 'test-project' ].problems ).toBeUndefined();
    } );

    /**
     * producer: GET/api/v1/test
     * consumer: GET /api/v1/test2
     * result: don't match
     */
    it( "Dont match different paths", () => {
      // Arrange
      const pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': {
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/test": {
                get: {}
              }
            }
          } as Project
        }
      } );
      const project: Project = {
        info: new ProjectInfo( 'order-project', 'group3', '3.0.0', [ '3.0.0', '2.0.0', '1.0.0' ] ),
        dependencies: {
          'test-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/test2": {
                get: {}
              }
            }
          }
        }
      } as Project;

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      expect( 1).toEqual( project.dependencies[ 'test-project' ].problems.length );
    } );

    /**
     * producer: GET  /api/v1/test
     * consumer: POST /api/v1/test
     * result: don't match
     */
    it( "Dont match different methods", () => {
      // Arrange
      const pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': {
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/test": {
                get: {}
              }
            }
          } as Project
        }
      } );
      const project: Project = {
        info: new ProjectInfo( 'order-project', 'group3', '3.0.0', [ '3.0.0', '2.0.0', '1.0.0' ] ),
        dependencies: {
          'test-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/test": {
                post: {}
              }
            }
          }
        }
      } as Project;

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      expect( 1).toEqual( project.dependencies[ 'test-project' ].problems.length );
    } );

    /**
     * producer: GET /api/v{apiVersion}/customers/{customerId}/status
     * consumer: GET /api/v{apiVersion}/customers/{customerId}/status
     * result: match
     */
    it( "Match both same path params", () => {
      // Arrange
      const pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': {
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v{apiVersion}/customers/{customerId}/status": {
                get: {
                  parameters: [
                    {
                      name: 'apiVersion',
                      'in': 'path',
                      type: SchemaTypes.NUMBER,
                      required: true
                    },
                    {
                      name: 'customerId',
                      'in': 'path',
                      type: SchemaTypes.INTEGER,
                      required: true
                    }
                  ]
                }
              }
            }
          } as Project
        }
      } );
      const project: Project = {
        info: new ProjectInfo( 'order-project', 'group3', '3.0.0', [ '3.0.0', '2.0.0', '1.0.0' ] ),
        dependencies: {
          'test-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v{apiVersion}/customers/{customerId}/status": {
                get: {
                  parameters: [
                    {
                      name: 'apiVersion',
                      'in': 'path',
                      type: SchemaTypes.NUMBER,
                      required: true
                    },
                    {
                      name: 'customerId',
                      'in': 'path',
                      type: SchemaTypes.INTEGER,
                      required: true
                    }
                  ]
                }
              }
            }
          }
        }
      } as Project;

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      expect( project.dependencies[ 'test-project' ].problems ).toBeUndefined();
    } );

    /**
     * producer: GET /api/v1/customers/status
     * consumer: GET /api/v1/{resource}/status
     * result: don't match
     * cannot ensure that the given resource exists
     */
    it( "Dont match consumer param is missing on the producer", () => {
      // Arrange
      const pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': {
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/customers/status": {
                get: {}
              }
            }
          } as Project
        }
      } );
      const project: Project = {
        info: new ProjectInfo( 'order-project', 'group3', '3.0.0', [ '3.0.0', '2.0.0', '1.0.0' ] ),
        dependencies: {
          'test-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/{resource}/status": {
                get: {}
              }
            }
          }
        }
      } as Project;

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      expect( 1).toEqual( project.dependencies[ 'test-project' ].problems.length );
    } );

    /**
     * producer: GET /api/v1/customers/{customerId}/status
     * consumer: GET /api/v1/customers/5/status
     * result: match
     */
    it( "Match producer param is missing on the consumer", () => {
      // Arrange
      const pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': {
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/customers/{customerId}/status": {
                get: {
                  parameters: [
                    {
                      name: 'customerId',
                      'in': 'path',
                      type: SchemaTypes.INTEGER,
                      required: true
                    }
                  ]
                }
              }
            }
          } as Project
        }
      } );
      const project: Project = {
        info: new ProjectInfo( 'order-project', 'group3', '3.0.0', [ '3.0.0', '2.0.0', '1.0.0' ] ),
        dependencies: {
          'test-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/customers/5/status": {
                get: {}
              }
            }
          }
        }
      } as Project;

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      expect( project.dependencies[ 'test-project' ].problems ).toBeUndefined();
    } );

    /**
     * producer: GET /api/v1/customers/{customerId}
     * producer: GET /api/v1/customers/items
     * consumer: GET /api/v1/customers/items
     * result: match second
     */
    it( 'Take the right path', () => {
      // Arrange
      const pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': {
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/customers/{customerId}": {
                get: {
                  parameters: [
                    {
                      name: 'customerId',
                      'in': 'path',
                      type: SchemaTypes.INTEGER,
                      required: true
                    }
                  ]
                }
              },
              "/api/v1/customers/items": {
                get: {}
              }
            }
          } as Project
        }
      } );
      const project: Project = {
        info: new ProjectInfo( 'order-project', 'group3', '3.0.0', [ '3.0.0', '2.0.0', '1.0.0' ] ),
        dependencies: {
          'test-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/customers/items": {
                get: {}
              }
            }
          }
        }
      } as Project;

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      expect( project.dependencies[ 'test-project' ].problems ).toBeUndefined();
    } );
  } );

} );
