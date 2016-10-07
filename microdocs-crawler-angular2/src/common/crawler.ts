
import {ProjectReflection} from "typedoc";
import {ProjectBuilder} from 'microdocs-core-ts/dist/domain/builder/index';
import {ReflectionKind, ContainerReflection} from "typedoc/lib/models";

export abstract class Crawler{

  public crawl(projectBuilder:ProjectBuilder, projectReflection: ProjectReflection, declaration?: ContainerReflection):void{
    if(!declaration){
      declaration = projectReflection;
    }
    if(declaration.children) {
      declaration.children.forEach(ref => {
        switch (ref.kind) {
          case ReflectionKind.ExternalModule:
            this.crawl(projectBuilder, projectReflection, ref);
            break;
          case ReflectionKind.Class:
            this.crawlClass(projectBuilder, projectReflection, ref);
        }
      });
    }
  }

  public abstract crawlClass(projectBuilder:ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection):void;

}