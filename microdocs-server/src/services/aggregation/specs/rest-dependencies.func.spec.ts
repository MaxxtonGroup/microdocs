/// <reference path="../../../../typings/index.d.ts" />
import { assert } from 'chai';
import { Project, DependencyTypes, ProblemLevels, ProjectInfo, SchemaTypes } from "@maxxton/microdocs-core/domain";
import { PipeMock } from "./pipe-mock.spec";
import { resolveRestDependencies } from "../funcs/rest-dependencies.func";


describe( '#Aggregation: #resolveRestDependencies:', () => {

  it( '#Error when missing dependent project', () => {
    let pipeMock         = new PipeMock( {} );
    let project: Project = <Project>{
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
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
    let pipeMock         = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{ info: new ProjectInfo( 'test-project', 'test-group', '1.0.0', [ '1.0.0', '2.0.0' ] ) },
        '2.0.0': <Project>{ info: new ProjectInfo( 'test-project', 'test-group', '2.0.0', [ '1.0.0', '2.0.0' ] ) }
      }
    } );
    let project: Project = <Project>{
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
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
    let pipeMock         = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{ info: new ProjectInfo( 'test-project', 'test-group', '1.0.0', [ '1.0.0', '2.0.0' ] ) },
        '2.0.0': <Project>{ info: new ProjectInfo( 'test-project', 'test-group', '2.0.0', [ '1.0.0', '2.0.0' ] ) }
      }
    } );
    let project: Project = <Project>{
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
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
    let pipeMock         = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{ info: new ProjectInfo( 'test-project', 'test-group', '1.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) },
        '2.0.0': <Project>{
          info: new ProjectInfo( 'test-project', 'test-group', '2.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ),
          deprecated: true
        },
        '3.0.0': <Project>{ info: new ProjectInfo( 'test-project', 'test-group', '3.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) }
      }
    } );
    let project: Project = <Project>{
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST,
          version: '2.0.0'
        }
      }
    };

    resolveRestDependencies( pipeMock, project );

    assert.deepEqual( project.dependencies[ 'test-project' ].version, '2.0.0' );
    assert.deepEqual( project.dependencies[ 'test-project' ].problems.length, 1 );
  } );

  it( '#Find not dependency deprecated version', () => {
    let pipeMock         = new PipeMock( {
      'test-project': {
        '1.0.0': <Project>{ info: new ProjectInfo( 'test-project', 'test-group', '1.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) },
        '2.0.0': <Project>{ info: new ProjectInfo( 'test-project', 'test-group', '2.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) },
        '3.0.0': <Project>{ info: new ProjectInfo( 'test-project', 'test-group', '3.0.0', [ '1.0.0', '2.0.0', '3.0.0' ] ) }
      }
    } );
    let project: Project = <Project>{
      info: new ProjectInfo( 'project', 'test-group', '1.0.0', [ '1.0.0' ] ),
      dependencies: {
        'test-project': {
          type: DependencyTypes.REST,
          deprecatedVersions: [ '3.0.0', '2.0.0' ]
        }
      }
    };

    resolveRestDependencies( pipeMock, project );

    assert.deepEqual( project.dependencies[ 'test-project' ].version, '1.0.0' );
  } );


  describe( "#checkEndpoints", () => {

    /**
     * producer: GET /api/v1/test
     * consumer: GET /api/v1/test
     * result: match
     */
    it( "Match same paths", () => {
      // Arrange
      let pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': <Project>{
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/test": {
                get: {}
              }
            }
          }
        }
      } );
      let project: Project = <Project>{
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
      };

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      assert.isUndefined( project.dependencies[ 'test-project' ].problems );
    } );

    /**
     * producer: GET/api/v1/test
     * consumer: GET /api/v1/test2
     * result: don't match
     */
    it( "Dont match different paths", () => {
      // Arrange
      let pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': <Project>{
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/test": {
                get: {}
              }
            }
          }
        }
      } );
      let project: Project = <Project>{
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
      };

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      assert.equal( 1, project.dependencies[ 'test-project' ].problems.length );
    } );

    /**
     * producer: GET  /api/v1/test
     * consumer: POST /api/v1/test
     * result: don't match
     */
    it( "Dont match different methods", () => {
      // Arrange
      let pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': <Project>{
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/test": {
                get: {}
              }
            }
          }
        }
      } );
      let project: Project = <Project>{
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
      };

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      assert.equal( 1, project.dependencies[ 'test-project' ].problems.length );
    } );

    /**
     * producer: GET /api/v{apiVersion}/customers/{customerId}/status
     * consumer: GET /api/v{apiVersion}/customers/{customerId}/status
     * result: match
     */
    it( "Match both same path params", () => {
      // Arrange
      let pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': <Project>{
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
          }
        }
      } );
      let project: Project = <Project>{
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
      };

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      assert.isUndefined( project.dependencies[ 'test-project' ].problems );
    } );

    /**
     * producer: GET /api/v1/customers/status
     * consumer: GET /api/v1/{resource}/status
     * result: don't match
     * cannot ensure that the given resource exists
     */
    it( "Dont match consumer param is missing on the producer", () => {
      // Arrange
      let pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': <Project>{
            info: new ProjectInfo( 'test-project', 'group2', '3.0.1', [ '3.0.1' ] ),
            paths: {
              "/api/v1/customers/status": {
                get: {}
              }
            }
          }
        }
      } );
      let project: Project = <Project>{
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
      };

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      assert.equal( 1, project.dependencies[ 'test-project' ].problems.length );
    } );

    /**
     * producer: GET /api/v1/customers/{customerId}/status
     * consumer: GET /api/v1/customers/5/status
     * result: match
     */
    it( "Match producer param is missing on the consumer", () => {
      // Arrange
      let pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': <Project>{
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
          }
        }
      } );
      let project: Project = <Project>{
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
      };

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      assert.isUndefined( project.dependencies[ 'test-project' ].problems );
    } );

    /**
     * producer: GET /api/v1/customers/{customerId}
     * producer: GET /api/v1/customers/items
     * consumer: GET /api/v1/customers/items
     * result: match second
     */
    it( '#Take the right path', () => {
      // Arrange
      let pipeMock         = new PipeMock( {
        'test-project': {
          '3.0.1': <Project>{
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
          }
        }
      } );
      let project: Project = <Project>{
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
      };

      // Act
      resolveRestDependencies( pipeMock, project );

      // Assert
      console.info( "test: ", project );
      assert.isUndefined( project.dependencies[ 'test-project' ].problems );
    } );
  } );

} );