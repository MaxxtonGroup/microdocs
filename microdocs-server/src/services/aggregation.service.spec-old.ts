/// <reference path="../../typings/index.d.ts" />
import {assert} from 'chai';
import { Project, ProjectInfo, DependencyTypes, SchemaTypes } from "@maxxton/microdocs-core/domain";
import { ReportRepository } from "../repositories/report.repo";
import { ProjectSettingsRepository } from "../repositories/project-settings.repo";
import { ProjectSettings } from "@maxxton/microdocs-core/domain/settings/project-settings.model";
import { AggregationPipelineService as AggregationService } from "./aggregation-pipeline.service";
import { Schema } from "@maxxton/microdocs-core/domain/schema/schema.model";

describe( '#AggregationService:', () => {

  var env = 'default';
  var projectSettingsRepository:ProjectSettingsRepository;
  var reportRepository:ReportRepository;

  beforeEach( () => {
    reportRepository = new ReportRepositoryMock();
    projectSettingsRepository = new ProjectSettingsRepositoryMock( {
      "default": {
        default: true
      }
    } );
  } );

  describe( "#buildDependencyTree", () => {

    it( "#convert project to ProjectTree", () => {
      // Arrange
      var target = new AggregationService( null );
      var project1 = { info: new ProjectInfo('order-project', 'group3', '3.0.0', ['3.0.0', '2.0.0', '1.0.0'])  };
      var project2 = { info: new ProjectInfo('customer-project', 'group2', '3.0.1', ['3.0.1', '2.0.1', '1.0.1'])  };
      var projectCache = {
        'order-project':{'3.0.0': project1},
        'customer-project':{'3.0.1': project2}
      };

      // Act
      var result = target.buildDependencyTree(env, projectCache);

      // Assert
      assert.equal(result.projects.length, 2);

      assert.equal(result.projects[0].title, 'order-project');
      assert.equal(result.projects[0].group, 'group3');
      assert.equal(result.projects[0].version, '3.0.0');

      assert.equal(result.projects[1].title, 'customer-project');
      assert.equal(result.projects[1].group, 'group2');
      assert.equal(result.projects[1].version, '3.0.1');
    } );

    it( "#resolve REST dependency with reference", () => {
      // Arrange
      var target = new AggregationService( null, null, null);
      var project1 = {
        info: new ProjectInfo('order-project', 'group3', '3.0.0', ['3.0.0', '2.0.0', '1.0.0']),
        dependencies: {
          'customer-project': {
            type: DependencyTypes.REST
          }
        }
      };
      var project2 = { info: new ProjectInfo('customer-project', 'group2', '3.0.1', ['3.0.1', '2.0.1', '1.0.1'])  };
      reportRepository.storeProject(env, project2);
      var projectCache = {
        'order-project':{'3.0.0': project1},
        'customer-project':{'3.0.1': project2}
      };

      // Act
      var result = target.buildDependencyTree(env, projectCache);

      // Assert
      assert.equal(result.projects.length, 2);

      assert.equal(result.projects[0].title, 'order-project');
      assert.equal(result.projects[0].group, 'group3');
      assert.equal(result.projects[0].version, '3.0.0');

      assert.equal(result.projects[1].title, 'customer-project');
      assert.equal(result.projects[1].group, 'group2');
      assert.equal(result.projects[1].version, '3.0.1');

      assert.equal(result.projects[0].dependencies.length, 1);
      assert.equal(result.projects[0].dependencies[0].type, DependencyTypes.REST);
      assert.equal(result.projects[0].dependencies[0].item.reference, '#/customer-project');
    } );

    it( "#resolve REST dependency not latest", () => {
      // Arrange
      var target = new AggregationService( null, reportRepository, projectSettingsRepository);
      var project1 = {
        info: new ProjectInfo('order-project', 'group3', '3.0.0', ['3.0.0', '2.0.0', '1.0.0']),
        dependencies: {
          'customer-project': {
            type: DependencyTypes.REST,
            deprecatedVersions: ['3.0.1']
          }
        }
      };
      var project2 = { info: new ProjectInfo('customer-project', 'group2', '3.0.1', ['3.0.1', '2.0.1', '1.0.1'])  };
      var project3 = { info: new ProjectInfo('customer-project', 'group2', '2.0.1', ['3.0.1', '2.0.1', '1.0.1'])  };
      reportRepository.storeProject(env, project2);
      reportRepository.storeProject(env, project3);
      var projectCache = {
        'order-project':{'3.0.0': project1},
        'customer-project':{'3.0.1': project2}
      };

      // Act
      var result = target.buildDependencyTree(env, projectCache);

      // Assert
      assert.equal(result.projects.length, 2);

      assert.equal(result.projects[0].title, 'order-project');
      assert.equal(result.projects[0].group, 'group3');
      assert.equal(result.projects[0].version, '3.0.0');

      assert.equal(result.projects[1].title, 'customer-project');
      assert.equal(result.projects[1].group, 'group2');
      assert.equal(result.projects[1].version, '3.0.1');

      assert.equal(result.projects[0].dependencies.length, 1);
      assert.equal(result.projects[0].dependencies[0].type, DependencyTypes.REST);
      assert.isUndefined(result.projects[0].dependencies[0].item.reference);
      assert.equal(result.projects[0].dependencies[0].item.title, 'customer-project');
      assert.equal(result.projects[0].dependencies[0].item.group, 'group2');
      assert.equal(result.projects[0].dependencies[0].item.version, '2.0.1');
    } );

  } );

  describe("#checkEndpoints", () => {

    /**
     * producer: GET /api/v1/test
     * consumer: GET /api/v1/test
     * result: match
     */
    it("Match same paths", () => {
      // Arrange
      var target = new AggregationService( null, reportRepository, projectSettingsRepository);
      var producerProject = {
        info: new ProjectInfo('customer-project', 'group2', '3.0.1', ['3.0.1', '2.0.1', '1.0.1']),
        paths: {
          "/api/v1/test": {
            get: {}
          }
        }
      };
      var dependendProject = {
        info: new ProjectInfo('order-project', 'group3', '3.0.0', ['3.0.0', '2.0.0', '1.0.0']),
        dependencies: {
          'customer-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/test": {
                get: {}
              }
            }
          }
        }
      };
      var projectCache = {
        'order-project':{'3.0.0': dependendProject},
        'customer-project':{'3.0.1': producerProject}
      };

      // Act
      var result = target.buildDependencyTree(env, projectCache);

      // Assert
      assert.equal(result.projects.length, 2);
      assert.equal(result.projects[0].dependencies.length, 1);
      assert.equal(result.projects[0].dependencies[0].type, DependencyTypes.REST);
      assert.equal(result.projects[0].dependencies[0].problems, 0);
    });

    /**
     * producer: GET/api/v1/test
     * consumer: GET /api/v1/test2
     * result: don't match
     */
    it("Dont match different paths", () => {
      // Arrange
      var target = new AggregationService( null, reportRepository, projectSettingsRepository);
      var producerProject = {
        info: new ProjectInfo('customer-project', 'group2', '3.0.1', ['3.0.1']),
        paths: {
          "/api/v1/test": {
            get: {}
          }
        }
      };
      var dependendProject = {
        info: new ProjectInfo('order-project', 'group3', '3.0.0', ['3.0.0']),
        dependencies: {
          'customer-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/test2": {
                get: {}
              }
            }
          }
        }
      };
      var projectCache = {
        'order-project':{'3.0.0': dependendProject},
        'customer-project':{'3.0.1': producerProject}
      };

      // Act
      var result = target.buildDependencyTree(env, projectCache);

      // Assert
      assert.equal(result.projects.length, 2);

      assert.equal(result.projects[0].dependencies.length, 1);
      assert.equal(result.projects[0].dependencies[0].type, DependencyTypes.REST);
      assert.equal(result.projects[0].dependencies[0].problems, 1);
    });

    /**
     * producer: GET  /api/v1/test
     * consumer: POST /api/v1/test
     * result: don't match
     */
    it("Dont match different methods", () => {
      // Arrange
      var target = new AggregationService( null, reportRepository, projectSettingsRepository);
      var producerProject = {
        info: new ProjectInfo('customer-project', 'group2', '3.0.1', ['3.0.1']),
        paths: {
          "/api/v1/test": {
            get: {}
          }
        }
      };
      var dependendProject = {
        info: new ProjectInfo('order-project', 'group3', '3.0.0', ['3.0.0']),
        dependencies: {
          'customer-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/test": {
                post: {}
              }
            }
          }
        }
      };
      var projectCache = {
        'order-project':{'3.0.0': dependendProject},
        'customer-project':{'3.0.1': producerProject}
      };

      // Act
      var result = target.buildDependencyTree(env, projectCache);

      // Assert
      assert.equal(result.projects.length, 2);

      assert.equal(result.projects[0].dependencies.length, 1);
      assert.equal(result.projects[0].dependencies[0].type, DependencyTypes.REST);
      assert.equal(result.projects[0].dependencies[0].problems, 1);
    });

    /**
     * producer: GET /api/v{apiVersion}/customers/{customerId}/status
     * consumer: GET /api/v{apiVersion}/customers/{customerId}/status
     * result: match
     */
    it("Match both same path params", () => {
      // Arrange
      var target = new AggregationService( null, reportRepository, projectSettingsRepository);
      var producerProject = {
        info: new ProjectInfo('customer-project', 'group2', '3.0.1', ['3.0.1']),
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
      };
      var dependendProject = {
        info: new ProjectInfo('order-project', 'group3', '3.0.0', ['3.0.0']),
        dependencies: {
          'customer-project': {
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
      var projectCache = {
        'order-project':{'3.0.0': dependendProject},
        'customer-project':{'3.0.1': producerProject}
      };

      // Act
      var result = target.buildDependencyTree(env, projectCache);

      // Assert
      assert.equal(result.projects.length, 2);

      assert.equal(result.projects[0].dependencies.length, 1);
      assert.equal(result.projects[0].dependencies[0].type, DependencyTypes.REST);
      assert.equal(result.projects[0].dependencies[0].problems, 0);
    });

    /**
     * producer: GET /api/v1/customers/status
     * consumer: GET /api/v1/{resource}/status
     * result: don't match
     * cannot ensure that the given resource exists
     */
    it("Dont match consumer param is missing on the producer", () => {
      // Arrange
      var target = new AggregationService( null, reportRepository, projectSettingsRepository);
      var producerProject = {
        info: new ProjectInfo('customer-project', 'group2', '3.0.1', ['3.0.1']),
        paths: {
          "/api/v1/customers/status": {
            get: {}
          }
        }
      };
      var dependendProject = {
        info: new ProjectInfo('order-project', 'group3', '3.0.0', ['3.0.0']),
        dependencies: {
          'customer-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/{resource}/status": {
                get: {}
              }
            }
          }
        }
      };
      var projectCache = {
        'order-project':{'3.0.0': dependendProject},
        'customer-project':{'3.0.1': producerProject}
      };

      // Act
      var result = target.buildDependencyTree(env, projectCache);

      // Assert
      assert.equal(result.projects.length, 2);

      assert.equal(result.projects[0].dependencies.length, 1);
      assert.equal(result.projects[0].dependencies[0].type, DependencyTypes.REST);
      assert.equal(result.projects[0].dependencies[0].problems, 1);
    });

    /**
     * producer: GET /api/v1/customers/{customerId}/status
     * consumer: GET /api/v1/customers/5/status
     * result: match
     */
    it("Match producer param is missing on the consumer", () => {
      // Arrange
      var target = new AggregationService( null, reportRepository, projectSettingsRepository);
      var producerProject = {
        info: new ProjectInfo('customer-project', 'group2', '3.0.1', ['3.0.1']),
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
      };
      var dependendProject = {
        info: new ProjectInfo('order-project', 'group3', '3.0.0', ['3.0.0']),
        dependencies: {
          'customer-project': {
            type: DependencyTypes.REST,
            paths: {
              "/api/v1/customers/5/status": {
                get: {}
              }
            }
          }
        }
      };
      var projectCache = {
        'order-project':{'3.0.0': dependendProject},
        'customer-project':{'3.0.1': producerProject}
      };

      // Act
      var result = target.buildDependencyTree(env, projectCache);

      // Assert
      assert.equal(result.projects.length, 2);

      assert.equal(result.projects[0].dependencies.length, 1);
      assert.equal(result.projects[0].dependencies[0].type, DependencyTypes.REST);
      assert.equal(result.projects[0].dependencies[0].problems, 0);
    });
  });

} );


class ReportRepositoryMock implements ReportRepository {

  private store:any = {};

  getProjects( env:string ):ProjectInfo[] {
    var result:ProjectInfo[] = [];
    for ( var env in this.store ) {
      for ( var group in this.store[ env ] ) {
        for ( var title in this.store[ env ][ group ] ) {
          var versions:string[] = [];
          for ( var version in this.store[ env ][ group ][ title ] ) {
            versions.push( version );
          }
          if ( versions.length > 0 ) {
            var version     = versions.sort().reverse()[ 0 ];
            var projectInfo = new ProjectInfo( title, group, version, versions );
            result.push( projectInfo );
          }
        }
      }
    }
    return result;
  }

  getProject( env:string, info:ProjectInfo ):Project {
    if ( this.store[ env ] && this.store[ env ][ info.group ] && this.store[ env ][ info.group ][ info.title ] && this.store[ env ][ info.group ][ info.title ][ info.version ] ) {
      return this.store[ env ][ info.group ][ info.title ][ info.version ];
    }
    return null;
  }

  storeProject( env:string, project:Project ):void {
    if ( !this.store[ env ] ) {
      this.store[ env ] = {};
    }
    if ( !this.store[ env ][ project.info.group ] ) {
      this.store[ env ][ project.info.group ] = {};
    }
    if ( !this.store[ env ][ project.info.group ][ project.info.title ] ) {
      this.store[ env ][ project.info.group ][ project.info.title ] = {};
    }
    this.store[ env ][ project.info.group ][ project.info.title ][ project.info.version ] = project;
  }

  removeProject( env:string, info:ProjectInfo ):boolean {
    if ( this.store[ env ] && this.store[ env ][ info.group ] && this.store[ env ][ info.group ][ info.title ] && this.store[ env ][ info.group ][ info.title ][ info.version ] ) {
      delete this.store[ env ][ info.group ][ info.title ][ info.version ];
      return true;
    }
    return false;
  }

}

class ProjectSettingsRepositoryMock implements ProjectSettingsRepository {

  constructor( private envs:{} ) {
  }

  getEnvs():{} {
    return this.envs;
  }

  getSettings():ProjectSettings {
    return {};
  }

}