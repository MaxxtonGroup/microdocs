
import { ProcessPipe } from "./process.pipe";
import { Project, Tag } from "@maxxton/microdocs-core/dist/domain";
import { buildTags } from "../funcs";

export class BuildTagsPipe extends ProcessPipe{

  protected runEach( project:Project ):Project {
    let tags = buildTags(project);
    project.tags = tags.map(tagName => <Tag>{name:tagName});
    return project;
  }

}