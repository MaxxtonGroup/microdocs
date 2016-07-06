
import {Project} from "../domain/project.model";
import {ProjectInfo} from "../domain/common/project-info.model";

/**
 * @author Steven Hermans
 */
export interface ProjectRepository{

    getProjects():ProjectInfo[];

    getProject(projectInfo:ProjectInfo):Project;

}