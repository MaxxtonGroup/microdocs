
import { ProcessPipe } from "./process.pipe";
import { Project, Tag } from "@maxxton/microdocs-core/dist/domain";
import { buildTags } from "../funcs";

export class BuildTagsPipe extends ProcessPipe {

  protected runEach( project: Project ): Project {
    const tags = buildTags(project);
    project.tags = tags.map(tagName => ({name: tagName }));
    return project;
  }

}
