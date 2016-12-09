import { Pipe } from "../pipe";
import { ProjectTree, ProjectInfo, ProjectNode, DependencyNode, Project, Tag, Dependency} from "@maxxton/microdocs-core/domain";

/**
 * Build dependency tree based on the pipe result
 * @param pipe
 * @return {ProjectTree}
 */
export function buildTree( pipe:Pipe<any> ):ProjectTree {
  let projectTree = new ProjectTree();
  pipe.projects.forEach( ( projectInfo:ProjectInfo ) => {
    if ( projectInfo != null ) {
      let node = buildNode( pipe, projectInfo );
      projectTree.addProject( node );
    }
  } );
  return projectTree;
}

function buildNode( pipe:Pipe<any>, projectInfo:ProjectInfo ):ProjectNode {
  let projectNode = new ProjectNode( projectInfo.title, undefined, projectInfo.group, projectInfo.version, projectInfo.versions );

  // load project
  let project = pipe.getPrevProject( projectNode.title, projectNode.version );

  if ( project ) {
    if ( project.problemCount ) {
      projectNode.problems = project.problemCount;
    }
    if ( project.tags ) {
      projectNode.tags = project.tags.map( ( tag:Tag ) => tag.name );
    }
    if ( project.dependencies ) {
      for ( let depTitle in project.dependencies ) {
        let dependency:Dependency = project.dependencies[ depTitle ];
        if ( dependency.inherit !== true ) {
          let depProject:Project = pipe.getPrevProject( depTitle, dependency.version );
          if(depProject) {
            let depProjectNode    = buildNode( pipe, depProject.info );
            let problemCount   = dependency.problems ? dependency.problems.length : 0;
            let dependencyNode = new DependencyNode( depProjectNode, dependency.type, problemCount );
            projectNode.addDependency( dependencyNode );
          }
        }
      }
    }
  }

  return projectNode;
}