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
    }
        
    def (path, httpMethods) = getMappingElements(annotation)
    for (httpMethod in (httpMethods ?: defaultHttpMethods)) {
	addMapping classDoc, methodDoc, concatenatePaths(rootPath, path), httpMethod, params
    }
  }
  
  private def processParam(classDoc, methodDoc, parameter, rootPath, annotation, params) {
      def annotationType = Annotations.getTypeName(annotation)
      logger.info("[" + methodDoc.name() + "] annotype: " + annotationType)
      if (annotationType?.startsWith(PARAM_TYPE)) {
          def desc = null
          for(paramTag in methodDoc.paramTags()){
                logger.info("[" + paramTag.parameterName() + "] equals: " + parameter.name())
              if(paramTag.parameterName().equals(parameter.name())){
                  desc = paramTag.parameterComment()
                  break
              }
          }
          params << [
              name: (getElement(annotation.elementValues(), "name") != null ? getElement(annotation.elementValues(), "name") : getElement(annotation.elementValues(), "value")),
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
                    div {
                        if(param.required !== false){
                            b param.name
                        }else{
                            span param.name
                        }
                        span " : " + param.type
                        if(param.defaultValue != null){
                            span{
                                i String.valueOf(param.defaultValue)
                            }
                        }
                        if(param.desc != null)
                            span "// " + param.desc
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
