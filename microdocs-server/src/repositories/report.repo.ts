
import {Project} from "../domain/project.model";
import {ProjectInfo} from "../domain/common/project-info.model";

/**
 * @author Steven Hermans
 */
export interface ReportRepository{

    getProjects():ProjectInfo[];

    getProject(projectInfo:ProjectInfo):Project;

}