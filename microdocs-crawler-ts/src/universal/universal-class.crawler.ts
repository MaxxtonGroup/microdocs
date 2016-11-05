
import {ClassCrawler} from "../common/abstract/class.crawler";
import {ClassIdentity} from "../common/domain/class-identity";
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/lib/models";
import {ProjectBuilder} from '@maxxton/microdocs-core/builder';
import {ProjectInfo} from '@maxxton/microdocs-core/domain';

export class UniversalClassCrawler extends ClassCrawler{

  public crawl(classIdentity: ClassIdentity, projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): void {
    if(classReflection.comment) {
      if (this.isClient(classReflection)) {
        classIdentity.isClient = true;
        classIdentity.isComponent = true;
      } else if (this.isService(classReflection)) {
        classIdentity.isService = true;
        classIdentity.isComponent = true;
      } else if (this.isController(classReflection)) {
        classIdentity.isController = true;
        classIdentity.isComponent = true;
      } else if (this.isModel(classReflection)) {
        classIdentity.isModel = true;
      }

      var comment = classReflection.comment;
      if(comment.hasTag("projectname") || comment.hasTag("projectgroup")){
        if(!projectBuilder.project().info){
          projectBuilder.project().info = <ProjectInfo>{};
        }
        projectBuilder.project().info.description = comment.shortText;
        if(comment.hasTag("projectname")) {
          projectBuilder.project().info.title = comment.getTag("projectname").text.trim();
        }
        if(comment.hasTag("projectgroup")) {
          projectBuilder.project().info.group = comment.getTag("projectgroup").text.trim();
        }
      }
    }
  }


  private isClient(classReflection: ContainerReflection): boolean {
    return classReflection.comment.hasTag("client");
  }

  private isService(classReflection: ContainerReflection): boolean {
    return classReflection.comment.hasTag("service");
  }

  private isController(classReflection: ContainerReflection): boolean {
    return classReflection.comment.hasTag("controller");
  }

  private isModel(classReflection: ContainerReflection): boolean {
    return classReflection.comment.hasTag("model");
  }

}