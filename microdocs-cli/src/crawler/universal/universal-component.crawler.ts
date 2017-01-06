
import { ComponentCrawler } from "../common/abstract/component.crawler";
import { ProjectReflection } from "typedoc";
import { ContainerReflection, ReflectionKind, SignatureReflection } from "typedoc/dist/lib/models";
import {ComponentBuilder} from '@maxxton/microdocs-core/builder';
import {Method} from '@maxxton/microdocs-core/domain';

export class UniversalComponentCrawler extends ComponentCrawler{

  crawl( componentBuilder: ComponentBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection ): void {
    componentBuilder.title = classReflection.name;
    componentBuilder.component().name = classReflection.name;
    if(classReflection.comment){
      componentBuilder.component().description = classReflection.comment.shortText;
    }
    if(classReflection.sources){
      classReflection.sources.forEach(source => {
        componentBuilder.component().file = source.fileName;
      });
    }
    if(classReflection.children){
      classReflection.children.filter(child => child.kind == ReflectionKind.Method).forEach(methodReflection => {
        var method : Method = {};
        var name:string;
        methodReflection.signatures.forEach(signature => {
          name = getMethodName(signature);
          method.name = signature.name;
          if(signature.comment){
            method.description = signature.comment.text;
          }
          if(signature.sources){
            signature.sources.forEach(source => {
              method.lineNumber = source.line;
            });
          }
        });
        if(name){
          if(!componentBuilder.component().methods){
            componentBuilder.component().methods = {};
          }
          componentBuilder.component().methods[name] = method;
        }
      });
    }
  }

}

export function getMethodName(signature:SignatureReflection):string{
  var name = signature.name + '(';
  if(signature.parameters) {
    signature.parameters.forEach( ( param, index ) => {
      if ( index > 0 ) {
        name += ',';
      }
      name += param.type.toString();
    } );
  }
  name += ')';
  return name;
}