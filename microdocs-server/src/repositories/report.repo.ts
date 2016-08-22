
import {Project, ProjectInfo} from "microdocs-core-ts/dist/domain";

/**
 * @author Steven Hermans
 */
export interface ReportRepository{

    getProjects(env:string):ProjectInfo[];

    getProject(env:string, projectInfo:ProjectInfo):Project;

    storeProject(env:string, project:Project):void;

}