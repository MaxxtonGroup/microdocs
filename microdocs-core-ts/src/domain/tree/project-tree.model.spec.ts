/// <reference path="../../../typings/index.d.ts" />

import { expect, assert } from 'chai';
import { ProjectTree } from "./project-tree.model";
import { ProjectNode } from "./project-node.model";
import { DependencyNode } from "./dependency-node.model";
import { DependencyTypes } from '../';

describe( '#ProjectTree: ', () => {

  describe( '#addProject', () => {

    it( 'add new project', () => {
      let projectTree = new ProjectTree();
      let projectNode = new ProjectNode( 'test-project' );

      projectTree.addProject( projectNode );

      assert.deepEqual( projectTree.projects, [ projectNode ] );
    } );

    it( 'add existing project', () => {
      let projectTree  = new ProjectTree();
      let projectNode1 = new ProjectNode( 'test-project' );
      let projectNode2 = new ProjectNode( 'test-project' );
      projectTree.projects.push( projectNode1 );

      projectTree.addProject( projectNode2 );

      assert.deepEqual( projectTree.projects, [ projectNode2 ] );
    } );

  } );

  describe( '#removeProject', () => {

    it( 'remove existing project', () => {
      let projectTree = new ProjectTree();
      let projectNode = new ProjectNode( 'test-project' );
      projectTree.projects.push( projectNode );

      projectTree.removeProject( projectNode );

      assert.deepEqual( [], projectTree.projects );
    } );

    it( 'remove new project', () => {
      let projectTree = new ProjectTree();
      let projectNode = new ProjectNode( 'test-project' );

      projectTree.removeProject( projectNode );

      assert.deepEqual( projectTree.projects, [] );
    } );

    /**
     * Remove project from the root tree and remove dependencies to that project from all over the tree
     */
    it( 'remove project with reference', () => {
      let rawTree:any = {
        'test-project': {},
        'consume1-project': {
          'dependencies': {
            'test-project': {
              type: DependencyTypes.USES,
              item: {
                $ref: '#/test-project'
              }
            }
          }
        },
        'consume2-project': {
          'dependencies': {
            'test-project': {
              type: DependencyTypes.USES,
              item: {
                $ref: '#/test-project'
              }
            }
          }
        }
      };
      let projectTree = ProjectTree.link( rawTree );

      projectTree.removeProjectByName( 'test-project' );

      assert.deepEqual( projectTree.unlink(), {
        'consume1-project': {},
        'consume2-project': {}
      } );
    } );

    /**
     * Rearrange siblings from the removed node which are used else were
     */
    it( 'remove project and rearrange first siblings', () => {
      let rawTree:any = {
        'test-project': {
          version: '1.0.0',
          dependencies: {
            'test2-project': {
              type: DependencyTypes.USES,
              item: {
                version: '1.0.0',
                group: 'test-group2'
              }
            }
          }
        },
        'consume-project': {
          version: '1.0.0',
          dependencies: {
            'test3-project': {
              type: DependencyTypes.USES,
              item: {
                $ref: '#/test-project/dependencies/test2-project/item'
              }
            }
          }
        }
      };
      let projectTree = ProjectTree.link( rawTree );

      projectTree.removeProjectByName( 'test-project' );

      assert.deepEqual( projectTree.unlink(), {
        'consume-project': {
          version: '1.0.0',
          dependencies: {
            'test3-project': {
              type: DependencyTypes.USES,
              item: {
                version: '1.0.0',
                group: 'test-group2'
              }
            }
          }
        }
      });
    });

    /**
     * Rearrange siblings from the removed node which are used else were
     */
    it( 'remove project and rearrange nested siblings', () => {
      let rawTree:any = {
        'test-project': {
          version: '1.0.0',
          dependencies: {
            'test2-project': {
              type: DependencyTypes.USES,
              item: {
                group: 'test-group2',
                version: '1.0.0',
                dependencies: {
                  'test6-project': {
                    type: DependencyTypes.USES,
                    item: {
                      dependencies: {
                        'test3-project': {
                          type: DependencyTypes.USES,
                          item: {
                            $ref: '#/test-project/dependencies/test3-project/item'
                          }
                        }
                      },
                      group: 'test-group6',
                      version: '1.0.0'
                    }
                  },
                  'test4-project': {
                    type: DependencyTypes.USES,
                    item: {
                      version: '1.0.0',
                      group: 'test-group4',
                      dependencies: {
                        'test5-project': {
                          type: DependencyTypes.USES,
                          item: {
                            group: 'test-group5',
                            version: '1.0.0'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            'test3-project': {
              type: DependencyTypes.USES,
              item: {
                version: '1.0.0',
                group: 'test-group3'
              }
            }
          }
        },
        'consume-project': {
          version: '1.0.0',
          dependencies: {
            'consume2-project': {
              type: DependencyTypes.USES,
              item: {
                version: '1.0.0',
                dependencies: {
                  'consume3-project': {
                    item: {
                      version: '1.0.0',
                      dependencies: {
                        'test5-project': {
                          item: {
                            $ref: '#/test-project/dependencies/test2-project/item/dependencies/test4-project/item/dependencies/test5-project/item'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            'test6-project': {
              type: DependencyTypes.USES,
              item: {
                $ref: '#/test-project/dependencies/test2-project/item/dependencies/test6-project/item'
              }
            }
          }
        }
      };
      let projectTree = ProjectTree.link( rawTree );

      projectTree.removeProjectByName( 'test-project' );

      assert.deepEqual( projectTree.unlink(), {
        'consume-project': {
          version: '1.0.0',
          dependencies: {
            'consume2-project': {
              type: DependencyTypes.USES,
              item: {
                version: '1.0.0',
                dependencies: {
                  'consume3-project': {
                    item: {
                      version: '1.0.0',
                      dependencies: {
                        'test5-project': {
                          item: {
                            version: '1.0.0',
                            group: 'test-group5'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            'test6-project': {
              type: DependencyTypes.USES,
              item: {
                version: '1.0.0',
                group: 'test-group6',
                dependencies: {
                  'test3-project': {
                    type: DependencyTypes.USES,
                    item: {
                      version: '1.0.0',
                      group: 'test-group3'
                    }
                  }
                }
              }
            }
          }
        }
      } );
    } );

  } );

} );