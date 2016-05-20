package org.springdoclet.collectors;

import com.googlecode.jatl.MarkupBuilder;
import org.springdoclet.*;
import org.springdoclet.domain.*;
import com.sun.javadoc.*;
import java.util.*;
import java.util.logging.Logger;

import org.springdoclet.domain.Endpoint;

/**
 *
 * @author hermans.s
 */
public class RequestMappingCollector implements Collector {

    private static final Logger logger = Logger.getLogger(RequestMappingCollector.class.getName());

    private static final String FEIGN_CLIENT = "org.springframework.cloud.netflix.feign.FeignClient";
    private static final String REST_CONTROLLER = "org.springframework.web.bind.annotation.RestController";
    private static final String REQUEST_MAPPING = "org.springframework.web.bind.annotation.RequestMapping";
    private static final String REQUEST_METHOD = "org.springframework.web.bind.annotation.RequestMethod.";
    private static final String REQUEST_BODY = "org.springframework.web.bind.annotation.RequestBody";
    private static final String REQUEST_PARAM = "org.springframework.web.bind.annotation.RequestParam";
    private static final String PATH_VARIABLE = "org.springframework.web.bind.annotation.PathVariable";

    private List<Endpoint> endpoints = new ArrayList();
    private List<Client> clients = new ArrayList();
    private List<Type> viewModels = new ArrayList();

    private ModelCollector modelCollector;

    public RequestMappingCollector(ModelCollector modelCollector) {
        this.modelCollector = modelCollector;
    }

    public void processClass(ClassDoc classDoc, AnnotationDesc[] annotations) {
        AnnotationDesc restController = CollectorUtils.getAnnotation(annotations, REST_CONTROLLER);
        AnnotationDesc feignClient = CollectorUtils.getAnnotation(annotations, FEIGN_CLIENT);
        AnnotationDesc requestMapping = CollectorUtils.getAnnotation(annotations, REQUEST_MAPPING);
        List<Endpoint> endpoints;
        if (requestMapping != null) {
            MappingElement mappingElement = getMappingElements(requestMapping);
            String rootPath = mappingElement.getPath();
            String[] defaultHttpMethods = mappingElement.getMethods();
            endpoints = processMethods(classDoc, rootPath, defaultHttpMethods);
        } else {
            endpoints = processMethods(classDoc, "", new String[]{});
        }
        if (restController != null) {
            this.endpoints.addAll(endpoints);
        }
        if (feignClient != null) {
            AnnotationValue name = getElement(feignClient.elementValues(), "name");
            if (name == null) {
                name = getElement(feignClient.elementValues(), "serviceId");
            }
            clients.add(new Client((name != null ? name.toString() : null), endpoints));
        }
    }

    private List<Endpoint> processMethods(ClassDoc classDoc, String rootPath, String[] defaultHttpMethods) {
        List<Endpoint> endpoints = new ArrayList();
        MethodDoc[] methods = classDoc.methods(true);
        for (MethodDoc method : methods) {
            for (AnnotationDesc annotation : method.annotations()) {
                String annotationType = Annotations.getTypeName(annotation);
                if (annotationType != null && annotationType.startsWith(REQUEST_MAPPING)) {
                    MappingElement mappingElement = getMappingElements(annotation);

                    for (String requestMethod : defaultHttpMethods) {
                        endpoints.add(processMethod(classDoc, method, concatenatePaths(rootPath, mappingElement.getPath()), requestMethod, annotation));
                    }
                    for (String requestMethod : mappingElement.getMethods()) {
                        boolean done = false;
                        for (String doneMethod : defaultHttpMethods) {
                            if (doneMethod.equalsIgnoreCase(requestMethod)) {
                                done = true;
                            }
                        }
                        if (!done) {
                            endpoints.add(processMethod(classDoc, method, concatenatePaths(rootPath, mappingElement.getPath()), requestMethod, annotation));
                        }
                    }
                }
            }
        }
        return endpoints;
    }

    private Endpoint processMethod(ClassDoc classDoc, MethodDoc methodDoc, String path, String httpMethod, AnnotationDesc annotation) {
        System.out.println("processMethod: " + classDoc.qualifiedName() + "#" + methodDoc.name());
        Endpoint endpoint = new Endpoint(path, httpMethod);
        for (Parameter parameter : methodDoc.parameters()) {
            // find description
            String description = null;
            for(Tag tag : methodDoc.tags()){
                if(tag.text().trim().startsWith(parameter.name())){
                    description = tag.text();
                    break;
                }
            }

            Schema schema = modelCollector.parseSchema(parameter.type());
            if(CollectorUtils.getAnnotation(parameter.annotations(), REQUEST_BODY) != null){
                endpoint.setRequestBody(schema);
            }else if(CollectorUtils.getAnnotation(parameter.annotations(), REQUEST_PARAM) != null){
                AnnotationDesc requestParam = CollectorUtils.getAnnotation(parameter.annotations(), REQUEST_PARAM);
                AnnotationValue name = getElement(requestParam.elementValues(), "name");
                if(name != null){
                    AnnotationValue defaultValue = getElement(requestParam.elementValues(), "defaultValue");
                    AnnotationValue required = getElement(requestParam.elementValues(), "required");
                    endpoint.addRequestParam(name.toString(), modelCollector.parseSchema(parameter.type()), description, (defaultValue != null ? defaultValue.toString() : null), required != null ? (boolean)required.value() : false);
                }
            }else if(CollectorUtils.getAnnotation(parameter.annotations(), PATH_VARIABLE) != null){
                AnnotationDesc pathVariable = CollectorUtils.getAnnotation(parameter.annotations(), PATH_VARIABLE);
                AnnotationValue name = getElement(pathVariable.elementValues(), "name");
                if(name != null){
                    endpoint.addPathVariable(name.toString(), modelCollector.parseSchema(parameter.type()), description);
                }
            }else if(parameter.type().qualifiedTypeName().equals("org.springframework.data.domain.Pageable")){
                endpoint.addRequestParam(new Field("page", new Schema(Schema.NUMBER, null, false), "0", null));
                endpoint.addRequestParam(new Field("size", new Schema(Schema.NUMBER, null, false), "20", null));
                endpoint.addRequestParam(new Field("sort", new Schema(Schema.STRING, null, false), "asc", null));
            } else if (parameter.typeName().equals("org.springframework.data.jpa.domain.Specifications")) {
                endpoint.addRequestParam(new Field("filter", new Schema(Schema.STRING, null, false), null, null));
            } else /**if (parameter.type().qualifiedTypeName().startsWith("com.maxxton") && parameter.annotations().length == 0 ) */{ //custom filter object
                if (schema instanceof SchemaObject) {
                    for (Map.Entry<String, Schema> entry : ((SchemaObject) schema).getProperties().entrySet()) {
                        endpoint.addRequestParam(new Field(entry.getKey(), entry.getValue(), entry.getValue().getDescription(), null, entry.getValue().isRequired()));
                    }
                }
            }
        }
        endpoint.setResponseBody(modelCollector.parseSchema(methodDoc.returnType()));
        return endpoint;
    }

    private String concatenatePaths(String rootPath, String path) {
        return (rootPath + path).replaceAll("\"\"", "/").replaceAll("//", "/").replaceAll("\"", "");
    }

    private MappingElement getMappingElements(AnnotationDesc annotation) {
        AnnotationDesc.ElementValuePair[] elements = annotation.elementValues();
        String path = getElement(elements, "value").toString() != null ? getElement(elements, "value").toString() : "";
        String[] httpMethods = new String[]{};
        if (getElement(elements, "method") != null) {
            AnnotationValue[] values = (AnnotationValue[]) getElement(elements, "method").value();
            httpMethods = new String[values.length];
            for (int i = 0; i < values.length; i++) {
                String[] fullName = values[i].toString().split("\\.");
                httpMethods[i] = fullName[fullName.length-1];
            }
        }
        return new MappingElement(path, httpMethods);
    }

    private AnnotationValue getElement(AnnotationDesc.ElementValuePair[] elements, String key) {
        for (AnnotationDesc.ElementValuePair element : elements) {
            if (element.element().name().equals(key)) {
                return element.value();
            }
        }
        return null;
    }

    public Map<String, Object> getMapping() {
        Map<String, Object> mapping = new HashMap();
        mapping.put("client", clients);
        mapping.put("endpoints", endpoints);
        return mapping;
    }

//    private void addMapping(classDoc, methodDoc, result, path, httpMethod, params, body) {
//        def httpMethodName = httpMethod.toString() - REQUEST_METHOD
//        mappings << [path: path,
//            httpMethodName: httpMethodName,
//            className: classDoc.qualifiedTypeName(),
//            position: (methodDoc.position() != null ? methodDoc.position().line() : null),
//            text: TextUtils.getFirstSentence(methodDoc.commentText()),
//            params: params,
//            body: body,
//            result: result]
//    }
    public void writeOutput(MarkupBuilder builder, PathBuilder paths) {
//        builder.div(id:'request-mappings') {
//            h2 'Request Mappings'
//            table {
//                def sortedMappings = mappings.sort { it.path }
//                tr {
//                    th 'Method'
//                    th 'Path'
//                    th 'Parameters'
//                    th 'Request Body'
//                    th 'Response Body'
//                    th 'Description'
//                }
//                for (mapping in sortedMappings) {
//                    tr {
//                        td class: mapping.httpMethodName.toLowerCase(), mapping.httpMethodName
//                        td {
//                            a(href: paths.buildFilePath(mapping.className) + (mapping.position != null ? "#" + mapping.position : ""), mapping.path)
//                        }
//                        td {
//                            for(param in mapping.params){
//                                if(param.name != null && !"".equals(param.name)){
//                                    div {
//                                        if(param.name != null){
//                                            if(param.required != false){
//                                                b param.name.replaceAll("\"\"", "/").replaceAll("//", "/").replaceAll("\"", "")
//                                            }else{
//                                                span param.name.replaceAll("\"\"", "/").replaceAll("//", "/").replaceAll("\"", "")
//                                            }
//                                        }
//                                        if(param.type instanceof String){
//                                            span " : " + param.type
//                                        }else if(param.type instanceof ParameterizedTypeImpl){
//                                            def string = param.type.simpleTypeName()
//                                            if(param.type.typeArguments().length > 0){
//                                                string += "<"
//                                            }
//                                            def first = true
//                                            for(type in param.type.typeArguments()){
//                                                if(!first){
//                                                    string += ","
//                                                }
//                                                string += type.simpleTypeName()
//                                                first = false
//                                            }
//                                            if(param.type.typeArguments().length > 0){
//                                                string += ">"
//                                            }
//                                            span " : " + string
//                                        }
//                                        if(param.defaultValue != null){
//                                            def defaultValue = String.valueOf(param.defaultValue).replaceAll("\"\"", "/").replaceAll("//", "/").replaceAll("\"", "")
//                                            if(defaultValue != 0 && !defaultValue.equals("0"))
//                                            span " = " + String.valueOf(param.defaultValue)
//                                        }
//                                        if(param.desc != null)
//                                        span class: 'comment', "// " + param.desc
//                                    }
//                                }
//                            }
//                        }
//                        td {
//                            if(mapping.body != null){
//                                a(href: paths.buildFilePath(mapping.body.qualifiedTypeName()), mapping.body.simpleTypeName())
//                                if(mapping.body instanceof ParameterizedTypeImpl){
//                                    if(mapping.body.typeArguments().length > 0){
//                                        span "<"
//                                    }
//                                    def first = true
//                                    for(type in mapping.body.typeArguments()){
//                                        if(!first){
//                                            span ","
//                                        }
//                                        a(href: paths.buildFilePath(type.qualifiedTypeName()), type.simpleTypeName())
//                                        first = false
//                                    }
//                                    if(mapping.body.typeArguments().length > 0){
//                                        span ">"
//                                    }
//                                }
//                    
//                            }
//                        }
//                        td {
//                            if(mapping.result != null && !mapping.result.simpleTypeName().equals("void")){
//                                a(href: paths.buildFilePath(mapping.result.qualifiedTypeName()), mapping.result.simpleTypeName())
//                                if(mapping.result instanceof ParameterizedTypeImpl){
//                                    if(mapping.result.typeArguments().length > 0){
//                                        span "<"
//                                    }
//                                    def first = true
//                                    for(type in mapping.result.typeArguments()){
//                                        if(!first){
//                                            span ","
//                                        }
//                                        a(href: paths.buildFilePath(type.qualifiedTypeName()), type.simpleTypeName())
//                                        first = false
//                                    }
//                                    if(mapping.result.typeArguments().length > 0){
//                                        span ">"
//                                    }
//                                }
//                    
//                            }
//                        }
//                        td { code { mkp.yieldUnescaped(mapping.text ?: ' ') } }
//                    }
//                }
//            }
//        }
    }

    public List<Type> getViewModels() {
        return viewModels;
    }

    private class MappingElement {

        private final String path;
        private final String[] methods;

        public MappingElement(String path, String[] methods) {
            this.path = path;
            this.methods = methods;
        }

        public String getPath() {
            return path;
        }

        public String[] getMethods() {
            return methods;
        }

    }
}
