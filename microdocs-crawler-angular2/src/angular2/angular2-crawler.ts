import {Crawler} from "../common/crawler";
import {ProjectReflection} from "typedoc";
import {ProjectBuilder} from 'microdocs-core-ts/dist/builder/index';
import {
  APPLICATION,
  SERVICE,
  CLIENT,
  CONFIGURATION,
  COMPONENT
} from 'microdocs-core-ts/dist/domain/component/component-type.model';
import {ReflectionKind, ContainerReflection, DeclarationReflection, ReferenceType} from "typedoc/lib/models";
import {ClientCollector} from "./client-collector";

export class Angular2Crawler extends Crawler {

  private clientCollector = new ClientCollector();

  crawlClass(projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): void {
    var type: string;
    if(this.isClient(classReflection)){
      type = CLIENT;
      projectBuilder.dependency(this.clientCollector.collect(classReflection));
    }else if(this.isService(classReflection)){
      type = SERVICE;
    }
    console.info('Class: ' + classReflection.name + " type: " + type);
  }

  private isClient(classReflection: ContainerReflection):boolean{
    var declaration = classReflection as DeclarationReflection;
    if (declaration && declaration.extendedTypes) {
      for(var i = 0; i < declaration.extendedTypes.length; i++){
        switch ((declaration.extendedTypes[i] as ReferenceType).name) {
          case 'RestClient':
            return true;
        }
      }
    }
    return false;
  }

  private isService(classReflection: ContainerReflection):boolean{
    if (classReflection.decorators) {
      for(var i = 0; i < classReflection.decorators.length; i++){
        switch (classReflection.decorators[i].name) {
          case 'Injectable':
            return true;
        }
      }
    }
    return false;
  }

}