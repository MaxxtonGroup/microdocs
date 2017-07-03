import {ProjectRepository} from "../repositories/project.repo";
import {SchemaHelper} from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import {ProjectTree, Project} from "@maxxton/microdocs-core/domain";

export class ProjectService {

  constructor(private projectRepo: ProjectRepository) {
  }

  public storeAggregatedProjects(env: string, projectTree: ProjectTree): void {

    let problems = checkCircularStructure(projectTree);
    if (problems) {
      problems.forEach(problem => {
        console.warn(`[${env}/index] circular structure: ${problem}`);
      });
    }

    this.projectRepo.storeAggregatedProjects(env, projectTree);
  }

  public storeAggregatedProject(env: string, project: Project): void {
    this.addResponseExamples(project);

    let problems = checkCircularStructure(project);
    if (problems) {
      problems.forEach(problem => {
        console.warn(`[${env}/${project.info.title}:${project.info.version}] circular structure: ${problem}`);
      });
    }

    this.projectRepo.storeAggregatedProject(env, project);
  }

  private addResponseExamples(project: Project) {
    project.swagger = "2.0";
    if (project.paths != undefined) {
      for (var path in project.paths) {
        for (var method in project.paths[path]) {
          var endpoint = project.paths[path][method];
          if (endpoint.responses != undefined && endpoint.responses['default'] != undefined && endpoint.responses['default'].schema != undefined) {
            var response = endpoint.responses['default'];
            var schema = response.schema;
            var example = SchemaHelper.generateExample(schema, undefined, [], project);
            schema.default = example;
          }
        }
      }
    }
  }
}

/**
 * Detect circular structure in the object
 * @param object
 * @return problems detections
 */
function checkCircularStructure(object: any, objectStore: {path: string, object: any}[] = [], problems: string[] = [], path: string = '.'): string[] {
  let stack = objectStore.map(obj => obj);

  if (object && typeof(object) === 'object') {
    let stackItem = stack.filter(stackItem => stackItem.object === object)[0];
    if (stackItem) {
      problems.push(path + " <=> " + stackItem.path);
    } else {
      stack.push({path: path, object: object});
      for (let key in object) {
        let propertyPath = path === '.' ? key : path + '.' + key;
        checkCircularStructure(object[key], stack, problems, propertyPath);
      }
    }
  }

  return problems;
}