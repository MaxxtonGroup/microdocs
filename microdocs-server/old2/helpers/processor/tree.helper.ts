import { ProjectTree, ProjectInfo, ProjectNode, DependencyNode, Project, Tag, Dependency, ProjectMetadata} from "@maxxton/microdocs-core/domain";
import { DocumentCacheHelper } from "./document-cache.helper";
import { ProjectService } from "../../services/project.service";

/**
 * Build dependency tree based on the pipe result
 * @return {ProjectTree}
 * @param projects
 * @param documentCache
 */
export function buildTree( projects:ProjectMetadata[], documentCache:DocumentCacheHelper ):ProjectTree {
  let projectTree = new ProjectTree();
  projects.forEach( ( projectMetadata ) => {
    let node = buildNode( projectMetadata, projectMetadata.latestTag, projects, documentCache );
    projectTree.addProject( node );
  } );
  return projectTree;
}

function buildNode(projectMetadata:ProjectMetadata, latestTag:string, projects:ProjectMetadata[], documentCache:DocumentCacheHelper ):ProjectNode {
  let projectNode = new ProjectNode( projectMetadata.title, undefined, projectMetadata.group, latestTag, ProjectService.sortTags(projectMetadata));
  projectNode.color = projectMetadata.color;

  // load project
  let project = documentCache.getProjectDocument(projectMetadata.title, projectMetadata.latestTag);

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
          let depProject:Project = documentCache.getProjectDocument( depTitle, dependency.tag );
          let depMetadata:ProjectMetadata = projects.filter(p => p.title.toLowerCase() === depTitle.toLowerCase())[0];
          if(depProject && depMetadata) {
            let depProjectNode    = buildNode( depMetadata, dependency.tag, projects, documentCache );
            let problemCount = 0;
            if(project.problems){
              let problems = project.problems.filter(problem => (problem.source && problem.source.path && problem.source.path.startsWith("dependencies." + depTitle)));
              problemCount = problems.length;
            }
            let dependencyNode = new DependencyNode( depProjectNode, dependency.type, problemCount );
            projectNode.addDependency( dependencyNode );
          }
        }
      }
    }
  }

  return projectNode;
}