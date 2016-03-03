package org.springdoclet.collectors

import com.sun.javadoc.AnnotationDesc
import com.sun.javadoc.ClassDoc
import com.sun.javadoc.Parameter
import groovy.xml.MarkupBuilder
import org.springdoclet.Collector
import org.springdoclet.Annotations
import org.springdoclet.PathBuilder
import org.springdoclet.TextUtils
import java.util.logging.Logger

@SuppressWarnings("GroovyVariableNotAssigned")
class RequestMappingCollector implements Collector {
  private static String MAPPING_TYPE = 'org.springframework.web.bind.annotation.RequestMapping'
  private static String METHOD_TYPE = 'org.springframework.web.bind.annotation.RequestMethod.'
  private static String PARAM_TYPE = 'org.springframework.web.bind.annotation.RequestParam'
  
  Logger logger = Logger.getLogger(RequestMappingCollector.class.getName())

  private mappings = []

  void processClass(ClassDoc classDoc, AnnotationDesc[] annotations) {
    def annotation = getMappingAnnotation(annotations)
    if (annotation) {
      def rootPath, defaultHttpMethods
      (rootPath, defaultHttpMethods) = getMappingElements(annotation)
      processMethods classDoc, rootPath ?: "", defaultHttpMethods ?: ['GET']
    } else {
      processMethods classDoc, "", ['GET']
    }
  }

  private void processMethods(classDoc, rootPath, defaultHttpMethods) {
    def methods = classDoc.methods(true)
    for (method in methods) {
      for (annotation in method.annotations()) {
        def annotationType = Annotations.getTypeName(annotation)
        if (annotationType?.startsWith(MAPPING_TYPE)) {
          processMethod classDoc, method, rootPath, defaultHttpMethods, annotation
        }
      }
    }
  }

  private def processMethod(classDoc, methodDoc, rootPath, defaultHttpMethods, annotation) {
    def params = []
    for (parameter in methodDoc.parameters()){
      for (parmAnnotation in parameter.annotations()) {
        processParam (classDoc, methodDoc, parameter, rootPath, parmAnnotation, params)
      }
      if(parameter.typeName().equals("Pageable")){
          params << [
              name: "page",
              type: "int",
              required: false,
              defaultValue: "0"
          ];
          params << [
              name: "size",
              type: "int",
              required: false,
              defaultValue: "20"
          ];
          params << [
              name: "sort",
              type: "String",
              required: false,
              defaultValue: "asc"
          ];
      }
      // Todo: Check for Specifications 
    }
        
    def (path, httpMethods) = getMappingElements(annotation)
    for (httpMethod in (httpMethods ?: defaultHttpMethods)) {
	addMapping classDoc, methodDoc, concatenatePaths(rootPath, path), httpMethod, params
    }
  }
  
  private def processParam(classDoc, methodDoc, parameter, rootPath, annotation, params) {
      def annotationType = Annotations.getTypeName(annotation)
      if (annotationType?.startsWith(PARAM_TYPE)) {
          def desc = null
          for(paramTag in methodDoc.paramTags()){
              if(paramTag.parameterName().equals(parameter.name())){
                  desc = paramTag.parameterComment()
                  break
              }
          }
          def name = (getElement(annotation.elementValues(), "name") != null ? getElement(annotation.elementValues(), "name") : getElement(annotation.elementValues(), "value"))
          params << [
              name: (name != null ? name.toString() : name),
              type: parameter.typeName(),
              required: getElement(annotation.elementValues(), "required"),
              defaultValue: getElement(annotation.elementValues(), "defaultValue"),
              desc: desc
          ];
      }
  }

  private def concatenatePaths(rootPath, path) {
	return "$rootPath$path".replaceAll("\"\"", "/").replaceAll("//", "/").replaceAll("\"", "")
  }

  private def getMappingAnnotation(annotations) {
    for (annotation in annotations) {
      def annotationType = Annotations.getTypeName(annotation)
      if (annotationType?.startsWith(MAPPING_TYPE)) {
        return annotation
      }
    }
    return null
  }

  private def getMappingElements(annotation) {
    def elements = annotation.elementValues()
    def path = getElement(elements, "value") ?: ""
    def httpMethods = getElement(elements, "method")?.value()
    return [path, httpMethods]
  }

  private def getElement(elements, key) {
    for (element in elements) {
      if (element.element().name() == key) {
        return element.value()
      }
    }
    return null
  }

  private void addMapping(classDoc, methodDoc, path, httpMethod, params) {
    def httpMethodName = httpMethod.toString() - METHOD_TYPE
    mappings << [path: path,
            httpMethodName: httpMethodName,
            className: classDoc.qualifiedTypeName(),
            text: TextUtils.getFirstSentence(methodDoc.commentText()),
            params: params]
  }

  void writeOutput(MarkupBuilder builder, PathBuilder paths) {
    builder.div(id:'request-mappings') {
      h2 'Request Mappings'
      table {
        def sortedMappings = mappings.sort { it.path }
        tr {
          th 'Method'
          th 'Path'
          th 'Parameters'
          th 'Description'
        }
        for (mapping in sortedMappings) {
          tr {
            td mapping.httpMethodName
            td {
                a(href: paths.buildFilePath(mapping.className), mapping.path)
            }
            td {
                for(param in mapping.params){
                    if(param.name != null && !"".equals(param.name)){
                        div {
                            if(param.name != null){
                                if(param.required != false){
                                    b param.name.replaceAll("\"\"", "/").replaceAll("//", "/").replaceAll("\"", "")
                                }else{
                                    span param.name.replaceAll("\"\"", "/").replaceAll("//", "/").replaceAll("\"", "")
                                }
                            }
                            span " : " + param.type
                            if(param.defaultValue != null){
                                def defaultValue = String.valueOf(param.defaultValue).replaceAll("\"\"", "/").replaceAll("//", "/").replaceAll("\"", "")
                                if(defaultValue != 0 && !defaultValue.equals("0"))
                                    span " = " + String.valueOf(param.defaultValue)
                            }
                            if(param.desc != null)
                                span class: 'comment', "// " + param.desc
//                                span "<span styles='color: blue'>// " + param.desc + "</span>"
                        }
                    }
                }
            }
            td { code { mkp.yieldUnescaped(mapping.text ?: ' ') } }
          }
        }
      }
    }
  }
}
