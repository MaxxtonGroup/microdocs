
import {Project} from "../domain/project.model";
import {TreeNode} from "../domain/tree/tree-node.model";

/**
 * @author Steven Hermans
 */
export interface AggregationRepository{

    // getAggregatedProjects():TreeNode;
    //
    // getAggregatedProjects(title:string,version:string):Project;

    storeAggregatedProjects(treeNode:TreeNode):void;

    storeAggregatedProject(project:Project):void;

}