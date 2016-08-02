
import {Project, ProjectInfo} from "microdocs-core-ts/dist/domain";

/**
 * @author Steven Hermans
 */
export interface ReportRepository{

    getProjects():ProjectInfo[];

    getProject(projectInfo:ProjectInfo):Project;

    storeProject(project:Project):void;

}