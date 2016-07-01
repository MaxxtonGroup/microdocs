package com.maxxton.microdocs.crawler.doclet_old.collectors;

import com.maxxton.microdocs.crawler.doclet_old.domain_old.SchemaObject;
import com.maxxton.microdocs.crawler.doclet_old.domain_old.ClassType;
import com.maxxton.microdocs.crawler.doclet_old.domain_old.SchemaArray;
import com.maxxton.microdocs.crawler.doclet_old.domain_old.Source;
import com.maxxton.microdocs.crawler.doclet_old.domain_old.Client;
import com.maxxton.microdocs.crawler.doclet_old.domain_old.Schema;
import com.maxxton.microdocs.crawler.doclet_old.domain_old.Field;
import com.maxxton.microdocs.crawler.doclet_old.domain_old.Endpoint;
import com.maxxton.microdocs.crawler.doclet_old.domain_old.Response;
import com.googlecode.jatl.MarkupBuilder;
import com.sun.javadoc.*;
import com.maxxton.microdocs.crawler.doclet_old.Annotations;
import com.maxxton.microdocs.crawler.doclet_old.Collector;
import com.maxxton.microdocs.crawler.doclet_old.CollectorUtils;
import com.maxxton.microdocs.crawler.doclet_old.PathBuilder;

import java.util.*;
import java.util.logging.Logger;

/**
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
        String[] defaultConsumes = new String[]{"application/json"};
        String[] defaultProduces = new String[]{"application/json"};
        if (requestMapping != null) {
            MappingElement mappingElement = getMappingElements(requestMapping);
            String rootPath = mappingElement.getPath();
            String[] defaultHttpMethods = mappingElement.getMethods();

            // check consumes
            AnnotationValue consumes = getElement(requestMapping.elementValues(), "consumes");
            if (consumes != null && consumes.value() != null && consumes.value() instanceof String[] && ((String[]) consumes.value()).length > 0) {
                defaultConsumes = (String[]) consumes.value();
            }
            // check produces
            AnnotationValue produces = getElement(requestMapping.elementValues(), "produces");
            if (produces != null && produces.value() != null && produces.value() instanceof String[] && ((String[]) produces.value()).length > 0) {
                defaultProduces = (String[]) produces.value();
            }


            endpoints = processMethods(classDoc, rootPath, defaultHttpMethods, defaultConsumes, defaultProduces);
        } else {
            endpoints = processMethods(classDoc, "", new String[]{}, defaultConsumes, defaultProduces);
        }
        if (restController != null) {
            this.endpoints.addAll(endpoints);
        }
        if (feignClient != null) {
            AnnotationValue name = getElement(feignClient.elementValues(), "name");
            if (name == null) {
                name = getElement(feignClient.elementValues(), "serviceId");
            }
            if (name == null) {
                name = getElement(feignClient.elementValues(), "value");
            }
            clients.add(new Client((name != null ? name.toString().replace("\"", "") : null), endpoints));
        }
    }

    private List<Endpoint> processMethods(ClassDoc classDoc, String rootPath, String[] defaultHttpMethods, String[] defaultConsumes, String[] defaultProduces) {
        List<Endpoint> endpoints = new ArrayList();
        MethodDoc[] methods = classDoc.methods(true);
        for (MethodDoc method : methods) {
            for (AnnotationDesc annotation : method.annotations()) {
                String annotationType = Annotations.getTypeName(annotation);
                if (annotationType != null && annotationType.startsWith(REQUEST_MAPPING)) {
                    MappingElement mappingElement = getMappingElements(annotation);

                    for (String requestMethod : defaultHttpMethods) {
                        endpoints.add(processMethod(classDoc, method, concatenatePaths(rootPath, mappingElement.getPath()), requestMethod, annotation, defaultConsumes, defaultProduces));
                    }
                    for (String requestMethod : mappingElement.getMethods()) {
                        boolean done = false;
                        for (String doneMethod : defaultHttpMethods) {
                            if (doneMethod.equalsIgnoreCase(requestMethod)) {
                                done = true;
                            }
                        }
                        if (!done) {
                            endpoints.add(processMethod(classDoc, method, concatenatePaths(rootPath, mappingElement.getPath()), requestMethod, annotation, defaultConsumes, defaultProduces));
                        }
                    }
                }
            }
        }
        return endpoints;
    }

    private Endpoint processMethod(ClassDoc classDoc, MethodDoc methodDoc, String path, String httpMethod, AnnotationDesc annotation, String[] defaultConsumes, String[] defaultProduces) {
        Endpoint endpoint = new Endpoint(httpMethod, path);
        endpoint.setDescription(methodDoc.commentText());

        // set source
        endpoint.setSource(new Source(classDoc.qualifiedTypeName(), classDoc.name(), methodDoc.position() != null ? methodDoc.position().line() : 0));

        // check @response
        for (Tag tag : methodDoc.tags("response")) {
            String index = CollectorUtils.getTagIndex(tag.text());
            if (index != null) {
                try {
                    int status = Integer.parseInt(index);
                    Response response = new Response(status, CollectorUtils.getTagDescription(tag.text()));
                    endpoint.getResponses().add(response);
                } catch (NumberFormatException e) {
                    throw new RuntimeException(tag.toString() + " statuscode is not a number @ " + classDoc.qualifiedName() + "#" + methodDoc.name() + " line " + methodDoc.position().line());
                }
            }
        }


        // check consumes
        Set<String> consumTypes = new HashSet();
        for (String type : defaultConsumes) {
            consumTypes.add(type);
        }
        AnnotationValue consumes = getElement(annotation.elementValues(), "consumes");
        if (consumes != null && consumes.value() != null && consumes.value() instanceof String[] && ((String[]) consumes.value()).length > 0) {
            for (String type : (String[]) consumes.value()) {
                consumTypes.add(type);
            }
            endpoint.setConsumes(consumTypes.toArray(new String[consumTypes.size()]));
        }
        // check produces
        Set<String> produceTypes = new HashSet();
        for (String type : defaultProduces) {
            produceTypes.add(type);
        }
        AnnotationValue produces = getElement(annotation.elementValues(), "produces");
        if (produces != null && produces.value() != null && produces.value() instanceof String[] && ((String[]) produces.value()).length > 0) {
            for (String type : (String[]) produces.value()) {
                produceTypes.add(type);
            }
            endpoint.setProduces(produceTypes.toArray(new String[produceTypes.size()]));
        }

        for (Parameter parameter : methodDoc.parameters()) {
            // find description
            String description = null;
            for (Tag tag : methodDoc.tags()) {
                if (tag.kind().equals("param") && tag.text().trim().startsWith(parameter.name())) {
                    description = CollectorUtils.getTagDescription(tag.text());
                    break;
                }
            }

            if (CollectorUtils.getAnnotation(parameter.annotations(), REQUEST_BODY) != null) {
                Schema schema = modelCollector.parseSchema(parameter.type());
                endpoint.setRequestBody(schema);
            } else if (CollectorUtils.getAnnotation(parameter.annotations(), REQUEST_PARAM) != null) {
                AnnotationDesc requestParam = CollectorUtils.getAnnotation(parameter.annotations(), REQUEST_PARAM);
                AnnotationValue name = getElement(requestParam.elementValues(), "name");
                System.out.println(parameter.name() + " - " + name);
                System.out.println(parameter.type().typeName());
                String nameString = parameter.name();
                if (name != null) {
                    nameString = name.toString();
                }
                AnnotationValue defaultValue = getElement(requestParam.elementValues(), "defaultValue");
                AnnotationValue required = getElement(requestParam.elementValues(), "required");
                endpoint.addRequestParam(nameString, modelCollector.parseSchema(parameter.type()).getType(), description, (defaultValue != null ? defaultValue.toString() : null), required != null ? (boolean) required.value() : false);
            } else if (CollectorUtils.getAnnotation(parameter.annotations(), PATH_VARIABLE) != null) {
                AnnotationDesc pathVariable = CollectorUtils.getAnnotation(parameter.annotations(), PATH_VARIABLE);
                AnnotationValue name = getElement(pathVariable.elementValues(), "value");
                String nameString = parameter.name();
                if (name != null) {
                    nameString = name.toString();
                }
                endpoint.addPathVariable(nameString, modelCollector.parseSchema(parameter.type()).getType(), description);
            } else if (parameter.type().qualifiedTypeName().equals("org.springframework.data.domain_old.Pageable")) {
                endpoint.addRequestParam(new Field("page", Schema.NUMBER, "page number", "0", false));
                endpoint.addRequestParam(new Field("size", Schema.NUMBER, "items per page", "20", false));
                endpoint.addRequestParam(new Field("sort", Schema.NUMBER, "sort option", "asc", false));
            } else if (parameter.typeName().equals("org.springframework.data.jpa.domain_old.Specifications")) {
                endpoint.addRequestParam(new Field("filter", Schema.STRING, "Filter query", null, false));
            } else /**if (parameter.type().qualifiedTypeName().startsWith("com.maxxton") && parameter.annotations().length == 0 ) */ { //custom filter object
                modelCollector.parseSchema(parameter.type());
                Schema schema = modelCollector.getSchemas().get(parameter.type().qualifiedTypeName());
                if (schema instanceof SchemaObject) {
                    for (Map.Entry<String, Schema> entry : ((SchemaObject) schema).getProperties().entrySet()) {
                        endpoint.addRequestParam(new Field(entry.getKey(), entry.getValue().getType(), entry.getValue().getDescription(), null, entry.getValue().isRequired()));
                    }
                }
            }
        }
        if (methodDoc.returnType().qualifiedTypeName().equals("org.springframework.data.domain_old.Page")) {
            endpoint.setResponseBody(createPageSchema(methodDoc.returnType()));
        } else if (methodDoc.returnType().qualifiedTypeName().equals("org.springframework.http.ResponseEntity")) {
            ClassType classType = CollectorUtils.getClassType(methodDoc.returnType());
            if (classType.getGeneric() != null) {
                endpoint.setResponseBody(modelCollector.parseSchema(classType.getGeneric()));
            }
        } else {
            endpoint.setResponseBody(modelCollector.parseSchema(methodDoc.returnType()));
        }
        return endpoint;
    }

    public Schema createPageSchema(Type returnType) {
        ClassType classType = CollectorUtils.getClassType(returnType);

        SchemaObject schemaObject = new SchemaObject(classType);
        Schema genericSchema;
        if(classType.getGeneric() != null){
            genericSchema = modelCollector.parseSchema(classType.getGeneric());
        }else{
            genericSchema = new SchemaObject(classType.getGenericType());
        }
        schemaObject.addProperty("content", new SchemaArray(genericSchema, classType.getGenericType()));
        schemaObject.addProperty("last", new Schema(Schema.BOOLEAN, null).setDummy(false));
        schemaObject.addProperty("first", new Schema(Schema.BOOLEAN, null).setDummy(true));
        schemaObject.addProperty("totalPages", new Schema(Schema.NUMBER, null).setDummy(20));
        schemaObject.addProperty("totalElements", new Schema(Schema.NUMBER, null).setDummy(196));
        schemaObject.addProperty("size", new Schema(Schema.NUMBER, null).setDummy(20));
        schemaObject.addProperty("number", new Schema(Schema.NUMBER, null).setDummy(1));
        schemaObject.addProperty("numberOfElements", new Schema(Schema.NUMBER, null).setDummy(20));
        schemaObject.addProperty("sort", new SchemaObject(null));

        return schemaObject;
    }

    private String concatenatePaths(String rootPath, String path) {
        String fullPath = "";
        if (rootPath != null) {
            fullPath += rootPath;
        }
        if (path != null) {
            fullPath += path;
        }

        fullPath = fullPath.replaceAll("//", "/").replaceAll("\"", "");
        return fullPath;
    }

    private MappingElement getMappingElements(AnnotationDesc annotation) {
        AnnotationDesc.ElementValuePair[] elements = annotation.elementValues();
        AnnotationValue pathVariable = getElement(elements, "value");
        if (pathVariable == null) {
            pathVariable = getElement(elements, "path");
        }
        String path = "";
        if (pathVariable != null) {
            path = pathVariable.toString();
        }
        String[] httpMethods = new String[]{};
        if (getElement(elements, "method") != null) {
            AnnotationValue[] values = (AnnotationValue[]) getElement(elements, "method").value();
            httpMethods = new String[values.length];
            for (int i = 0; i < values.length; i++) {
                String[] fullName = values[i].toString().split("\\.");
                httpMethods[i] = fullName[fullName.length - 1];
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
        mapping.put("clients", clients);
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
