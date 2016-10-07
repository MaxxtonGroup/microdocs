import {Project, TreeNode} from "microdocs-core-ts/dist/domain";

/**
 * @author Steven Hermans
 */
export interface ProjectRepository{

    getAggregatedProjects(env:string):TreeNode;

    getAggregatedProject(env:string, title:string,version:string):Project;

    storeAggregatedProjects(env:string, treeNode:TreeNode):void;

    storeAggregatedProject(env:string, project:Project):void;

}