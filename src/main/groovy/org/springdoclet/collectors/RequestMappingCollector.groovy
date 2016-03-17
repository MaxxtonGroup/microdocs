package org.springdoclet.collectors

import com.sun.javadoc.AnnotationDesc
import com.sun.javadoc.ClassDoc
import com.sun.javadoc.Parameter
import com.sun.javadoc.TypeVariable
import com.sun.tools.javadoc.ParameterizedTypeImpl
import groovy.xml.MarkupBuilder
import java.lang.reflect.ParameterizedType
import org.springdoclet.Collector
import org.springdoclet.Annotations
import org.springdoclet.PathBuilder
import org.springdoclet.TextUtils
import java.util.logging.Logger

@SuppressWarnings("GroovyVariableNotAssigned")
class RequestMappingCollector implements Collector {
  private static String MAPPING_TYPE = 'org.springframework.web.bind.annotation.RequestMapping'
  private static String METHOD_TYPE = 'org.springframework.web.bind.annotation.RequestMethod.'
  private static String BODY_TYPE = 'org.springframework.web.bind.annotation.RequestBody'
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
    def body = null
    for (parameter in methodDoc.parameters()){
      for (parmAnnotation in parameter.annotations()) {
        processParam (classDoc, methodDoc, parameter, rootPath, parmAnnotation, params)
        def b = processBodyParam (classDoc, methodDoc, parameter, rootPath, parmAnnotation)
        if(b != null){
            body = b;
        }
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
      }else if(parameter.typeName().equals("org.springframework.data.jpa.domain.Specifications")){
          params << [
              name: "filter",
              type: "String",
              required: false
          ];
      }else if(parameter.type().qualifiedTypeName().startsWith("com.maxxton") && parameter.annotations().length == 0){ //custom filter object
          def paramClassDoc = parameter.type().asClassDoc();
          if(paramClassDoc != null){
              def fields = paramClassDoc.fields(false);
              for(field in fields){
                  params << [
                    name: field.name(),
                    type: field.type(),
                    required: false
                ];
              }
          }
      }
    }
    def result = (methodDoc.returnType().asParameterizedType() != null ? methodDoc.returnType().asParameterizedType() : methodDoc.returnType())
        
    def (path, httpMethods) = getMappingElements(annotation)
    for (httpMethod in (httpMethods ?: defaultHttpMethods)) {
	addMapping classDoc, methodDoc, result, concatenatePaths(rootPath, path), httpMethod, params, body
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
              type: parameter.type(),
              required: getElement(annotation.elementValues(), "required"),
              defaultValue: getElement(annotation.elementValues(), "defaultValue"),
              desc: desc
          ];
      }
  }
  
  private def processBodyParam(classDoc, methodDoc, parameter, rootPath, annotation) {
      def annotationType = Annotations.getTypeName(annotation)
      if (annotationType?.startsWith(BODY_TYPE)) {
          return parameter.type()
      }
      return null;
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

  private void addMapping(classDoc, methodDoc, result, path, httpMethod, params, body) {
    def httpMethodName = httpMethod.toString() - METHOD_TYPE
    mappings << [path: path,
            httpMethodName: httpMethodName,
            className: classDoc.qualifiedTypeName(),
            position: (methodDoc.position() != null ? methodDoc.position().line() : null),
            text: TextUtils.getFirstSentence(methodDoc.commentText()),
            params: params,
            body: body,
            result: result]
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
          th 'Request Body'
          th 'Response Body'
          th 'Description'
        }
        for (mapping in sortedMappings) {
          tr {
            td class: mapping.httpMethodName.toLowerCase(), mapping.httpMethodName
            td {
                a(href: paths.buildFilePath(mapping.className) + (mapping.position != null ? "#" + mapping.position : ""), mapping.path)
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
                            if(param.type instanceof String){
                                span " : " + param.type
                            }else if(param.type instanceof ParameterizedTypeImpl){
                                def string = param.type.simpleTypeName()
                                if(param.type.typeArguments().length > 0){
                                    string += "<"
                                }
                                def first = true
                                for(type in param.type.typeArguments()){
                                    if(!first){
                                        string += ","
                                    }
                                    string += type.simpleTypeName()
                                    first = false
                                }
                                if(param.type.typeArguments().length > 0){
                                    string += ">"
                                }
                                span " : " + string
                            }
                            if(param.defaultValue != null){
                                def defaultValue = String.valueOf(param.defaultValue).replaceAll("\"\"", "/").replaceAll("//", "/").replaceAll("\"", "")
                                if(defaultValue != 0 && !defaultValue.equals("0"))
                                    span " = " + String.valueOf(param.defaultValue)
                            }
                            if(param.desc != null)
                                span class: 'comment', "// " + param.desc
                        }
                    }
                }
            }
            td {
                if(mapping.body != null){
                    a(href: paths.buildFilePath(mapping.body.qualifiedTypeName()), mapping.body.simpleTypeName())
                    if(mapping.body instanceof ParameterizedTypeImpl){
                        if(mapping.body.typeArguments().length > 0){
                            span "<"
                        }
                        def first = true
                        for(type in mapping.body.typeArguments()){
                            if(!first){
                                span ","
                            }
                            a(href: paths.buildFilePath(type.qualifiedTypeName()), type.simpleTypeName())
                            first = false
                        }
                        if(mapping.body.typeArguments().length > 0){
                            span ">"
                        }
                    }
                    
                }
            }
            td {
                if(mapping.result != null && !mapping.result.simpleTypeName().equals("void")){
                    a(href: paths.buildFilePath(mapping.result.qualifiedTypeName()), mapping.result.simpleTypeName())
                    if(mapping.result instanceof ParameterizedTypeImpl){
                        if(mapping.result.typeArguments().length > 0){
                            span "<"
                        }
                        def first = true
                        for(type in mapping.result.typeArguments()){
                            if(!first){
                                span ","
                            }
                            a(href: paths.buildFilePath(type.qualifiedTypeName()), type.simpleTypeName())
                            first = false
                        }
                        if(mapping.result.typeArguments().length > 0){
                            span ">"
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
