import { Pipe } from "../pipe";
import { ProjectTree, ProjectInfo, ProjectNode, DependencyNode, Project, Tag, Dependency} from "@maxxton/microdocs-core/domain";

/**
 * Build dependency tree based on the pipe result
 * @param pipe
 * @return {ProjectTree}
 */
export function buildTree( pipe: Pipe<any> ): ProjectTree {
  const projectTree = new ProjectTree();
  pipe.projects.forEach( ( projectInfo: ProjectInfo ) => {
    if ( projectInfo != null ) {
      const node = buildNode( pipe, projectInfo );
      projectTree.addProject( node );
    }
  } );
  return projectTree;
}

function buildNode( pipe: Pipe<any>, projectInfo: ProjectInfo, stack: Array<string> = [] ): ProjectNode {
  const projectNode = new ProjectNode( projectInfo.title, undefined, projectInfo.group, projectInfo.version, projectInfo.getVersions());
  projectNode.color = projectInfo.color;

  if (stack.indexOf(projectInfo.title + ":" + projectInfo.version) > -1) {
    return projectNode;
  }
  stack.push(projectInfo.title + ":" + projectInfo.version);

  // load project
  const project = pipe.getPrevProject( projectNode.title, projectNode.version );

  if ( project ) {
    if ( project.problemCount ) {
      projectNode.problems = project.problemCount;
    }
    if ( project.tags ) {
      projectNode.tags = project.tags.map( ( tag: Tag ) => tag.name );
    }
    if ( project.dependencies ) {
      for ( const depTitle in project.dependencies ) {
        const dependency: Dependency = project.dependencies[ depTitle ];
        if ( dependency.inherit !== true ) {
          const depProject: Project = pipe.getPrevProject( depTitle, dependency.version );
          if (depProject) {
            const depProjectNode    = buildNode( pipe, depProject.info, stack );
            const problemCount   = dependency.problems ? dependency.problems.length : 0;
            const dependencyNode = new DependencyNode( depProjectNode, dependency.type, problemCount );
            projectNode.addDependency( dependencyNode );
          }
        }
      }
    }
  }

  return projectNode;
}
