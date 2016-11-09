import { Pipe } from "../pipe";
import { ProjectTree, ProjectInfo, ProjectNode, DependencyNode} from "@maxxton/microdocs-core/domain";

/**
 * Build dependency tree based on the pipe result
 * @param pipe
 * @return {ProjectTree}
 */
export function buildTree( pipe:Pipe ):ProjectTree {
  let projectTree = new ProjectTree();
  pipe.projects.forEach( projectInfo => {
    let node = buildNode(pipe, projectInfo);
    projectTree.addProject(node);
  } );
  return projectTree;
}

function buildNode(pipe:Pipe, projectInfo:ProjectInfo):ProjectNode{
  let projectNode = new ProjectNode(projectInfo.title, undefined, projectInfo.group, projectInfo.version, projectInfo.versions);

  // load project
  let project = pipe.getPrevProject(projectNode.title, projectNode.version);

  if(project){
    if(project.problemCount){
      projectNode.problems = project.problemCount;
    }
    if(project.dependencies){
      for(let depTitle in project.dependencies){
        let dependency = project.dependencies[depTitle];
        if(dependency.inherit !== true) {
          let depInfo        = projectInfo.getVersion( dependency.version );
          let projectNode    = buildNode( pipe, depInfo );
          let problemCount   = dependency.problems ? dependency.problems.length : 0;
          let dependencyNode = new DependencyNode( projectNode, dependency.type, problemCount );
          projectNode.addDependency( dependencyNode );
        }
      }
    }
  }

  return projectNode;
}