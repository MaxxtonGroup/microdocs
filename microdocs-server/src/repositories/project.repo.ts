import {Project, TreeNode} from "microdocs-core-ts/dist/domain";

/**
 * @author Steven Hermans
 */
export interface ProjectRepository{

    getAggregatedProjects():TreeNode;

    getAggregatedProject(title:string,version:string):Project;

    storeAggregatedProjects(treeNode:TreeNode):void;

    storeAggregatedProject(project:Project):void;

}