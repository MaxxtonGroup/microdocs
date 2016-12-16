package com.maxxton.microdocs.crawler.spring.collector;

import com.maxxton.microdocs.core.domain.path.*;
import com.maxxton.microdocs.core.domain.schema.SchemaType;
import com.maxxton.microdocs.core.reflect.*;
import com.maxxton.microdocs.crawler.ErrorReporter;
import com.maxxton.microdocs.core.builder.PathBuilder;
import com.maxxton.microdocs.core.collector.Collector;
import com.maxxton.microdocs.core.collector.SchemaCollector;
import com.maxxton.microdocs.core.domain.schema.Schema;
import com.maxxton.microdocs.crawler.spring.parser.PageableParser;
import com.maxxton.microdocs.crawler.spring.parser.SpecificationsParser;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Steven Hermans
 */
public class PathCollector implements Collector<PathBuilder> {

    private final String[] defaultConsumes = new String[]{"application/json"};
    private final String[] defaultProduces = new String[]{"application/json"};

    private static final String TYPE_REQUEST_BODY = "org.springframework.web.bind.annotation.RequestBody";
    private static final String TYPE_REQUEST_PARAM = "org.springframework.web.bind.annotation.RequestParam";
    private static final String TYPE_PATH_VARIABLE = "org.springframework.web.bind.annotation.PathVariable";

    private SchemaCollector schemaCollector;
    private final String[] controllers;
    private final String requestMapping;

    private final RequestParser[] requestParsers = new RequestParser[]{
            new PageableParser(),
            new SpecificationsParser()
    };

    public PathCollector(SchemaCollector schemaCollector, String[] controllers, String requestMapping) {
        this.schemaCollector = schemaCollector;
        this.controllers = controllers;
        this.requestMapping = requestMapping;
    }

    @Override
    public List<PathBuilder> collect(List<ReflectClass<?>> classes) {
        List<PathBuilder> pathBuilders = new ArrayList();
        classes.stream().filter(reflectClass -> reflectClass.hasAnnotation(controllers)).forEach(controller -> {
            ErrorReporter.get().printNotice("Crawl controller: " + controller.getSimpleName());
            controller.getDeclaredMethods().stream().filter(method -> method.hasAnnotation(requestMapping)).forEach(method -> {
                ErrorReporter.get().printNotice("Crawl controller method: " + method.getSimpleName());
                pathBuilders.addAll(collectPaths(controller, method));
            });
        });
        return pathBuilders;
    }

    private List<PathBuilder> collectPaths(ReflectClass<?> controller, ReflectMethod method) {
        ReflectAnnotation controllerRequestMapping = controller.getAnnotation(requestMapping);
        ReflectAnnotation methodRequestMapping = method.getAnnotation(requestMapping);
        List<Parameter> parameters = new ArrayList();

        // find uri
        String controllerPath = getPath(controllerRequestMapping);
        String methodPath = getPath(methodRequestMapping);
        String fullPath = (controllerPath + "/" + methodPath).replace("\\\\", "/").replace("//", "/");
        if(!fullPath.startsWith("/")){
            fullPath = "/" + fullPath;
        }
        if(fullPath.endsWith("/")){
            fullPath = fullPath.substring(0, fullPath.length()-1);
        }
        String path;
        if (fullPath.contains("?")) {
            String[] pathSplit = fullPath.split("\\?");
            path = pathSplit[0];
            String paramsSplit = pathSplit[1];

            String[] params = paramsSplit.split("&");
            for(String param : params){
                String[] paramSplit = param.split("=");
                ParameterVariable parameter = new ParameterVariable();
                parameter.setIn(ParameterPlacing.QUERY);
                parameter.setName(paramSplit[0]);
                parameter.setRequired(true);
                parameter.setType(SchemaType.ANY);
                if(paramSplit.length > 1) {
                    parameter.setDefaultValue(paramSplit[1]);
                    parameter.setType(SchemaType.ENUM);
                    List enums = new ArrayList();
                    enums.add(paramSplit[1]);
                    parameter.setEnums(enums);
                }
                parameters.add(parameter);
            }
        } else {
            path = fullPath;
        }

        // find methods
        Set<String> methods = new HashSet();
        methods.addAll(getMethods(controllerRequestMapping));
        methods.addAll(getMethods(methodRequestMapping));
        if (methods.isEmpty()) { //use default
            methods.add("get");
            methods.add("post");
            methods.add("put");
            methods.add("delete");
            methods.add("options");
            methods.add("head");
            methods.add("patch");
        }

        Set<String> produces = new HashSet();
        for (String mime : defaultProduces) {
            produces.add(mime);
        }
        produces.addAll(getProduces(controllerRequestMapping));
        produces.addAll(getProduces(methodRequestMapping));

        Set<String> consumes = new HashSet();
        for (String mime : defaultConsumes) {
            consumes.add(mime);
        }
        consumes.addAll(getCondumes(controllerRequestMapping));
        consumes.addAll(getCondumes(methodRequestMapping));

        for(ReflectParameter parameter : method.getParameters()){
            if(parameter.getType() != null && parameter.getType().getClassType() != null) {
                RequestParser parser = null;
                for (RequestParser requestParser : requestParsers) {
                    if (requestParser.getClassName().equals(parameter.getType().getClassType().getName()) ||
                            requestParser.getClassName().equals(parameter.getType().getClassType().getSimpleName())){
                        parser = requestParser;
                        break;
                    }
                }
                if(parser != null){
                    List<Parameter> params = parser.parse(parameter, controller, method, schemaCollector);
                    parameters.addAll(params);
                    continue;
                }
            }

            String name = parameter.getName();
            Schema schema = schemaCollector.collect(parameter.getType());
            String description = null;
            for (ReflectDescriptionTag tag : method.getDescription().getTags("param")) {
                if (name.equals(tag.getKeyword())) {
                    description = tag.getDescription();
                    break;
                }
            }

            if (parameter.hasAnnotation(TYPE_REQUEST_BODY)) {
                ParameterBody bodyParam = new ParameterBody();
                bodyParam.setSchema(schema);
                bodyParam.setName(name);
                bodyParam.setDescription(description);
                bodyParam.setIn(ParameterPlacing.BODY);
                parameters.add(bodyParam);
            } else if (parameter.hasAnnotation(TYPE_REQUEST_PARAM)) {
                ReflectAnnotation annotation = parameter.getAnnotation(TYPE_REQUEST_PARAM);
                ParameterVariable param = new ParameterVariable();
                param.setIn(ParameterPlacing.QUERY);

                if(annotation.has("value")){
                    name = annotation.getString("value");
                }else if(annotation.has("name")){
                    name = annotation.getString("name");
                }
                param.setName(name);
                param.setDescription(description);
                param.setRequired(annotation.getBoolean("required"));
                param.setDefaultValue(annotation.getString("defaultValue"));
                param.setType(schema != null ? schema.getType() : null);
                parameters.add(param);
            } else if (parameter.hasAnnotation(TYPE_PATH_VARIABLE)) {
                ReflectAnnotation annotation = parameter.getAnnotation(TYPE_PATH_VARIABLE);
                ParameterVariable param = new ParameterVariable();
                param.setIn(ParameterPlacing.PATH);

                if(annotation.has("value")){
                    name = annotation.getString("value");
                }else if(annotation.has("name")){
                    name = annotation.getString("name");
                }
                param.setName(name);
                param.setDescription(description);
                param.setRequired(true);
                param.setType(schema != null ? schema.getType() : null);
                parameters.add(param);
            }
        }

        Map<String, Response> responses = new HashMap();
        if(method.getReturnType() != null && method.getReturnType().getClassType() != null && !method.getReturnType().getClassType().getSimpleName().equalsIgnoreCase("void")){
            Response response = new Response();
            for(ReflectDescriptionTag tag : method.getDescription().getTags("return")){
                response.setDescription(tag.getKeyword() + " " + tag.getDescription());
                break;
            }
            Schema schema = schemaCollector.collect(method.getReturnType());
            response.setSchema(schema);
            responses.put("default", response);
        }

        // collect response codes
        List<ReflectDescriptionTag> responseTags = method.getDescription().getTags("response");
        responseTags.forEach(tag -> {
            String responseCode = tag.getKeyword();
            Response response = new Response();
            response.setDescription( tag.getDescription());
            responses.put(responseCode, response);
        });


        // create builders
        List<PathBuilder> pathBuilders = new ArrayList();
        for (String requestMethod : methods) {
            PathBuilder builder = new PathBuilder();
            builder.path(path);
            builder.requestMethod(requestMethod);
            builder.component(controller);
            builder.method(method);
            builder.description(method.getDescription().getText());
            builder.operationId(method.getSimpleName());
            builder.parameters(parameters);
            builder.responses(responses);
            builder.consumes(consumes.stream().collect(Collectors.toList()));
            builder.produces(produces.stream().collect(Collectors.toList()));

            pathBuilders.add(builder);
        }
        return pathBuilders;
    }

    private String getPath(ReflectAnnotation requestMapping) {
        if (requestMapping != null) {
            if (requestMapping.has("value")) {
                return requestMapping.getString("value");
            } else if (requestMapping.has("path")) {
                return requestMapping.getString("path");
            }
        }
        return "";
    }

    private Set<String> getMethods(ReflectAnnotation requestMapping) {
        Set<String> methodSet = new HashSet();
        if (requestMapping != null) {

            String[] methods = requestMapping.getArray("method");
            if (methods != null) {
                for (String method : methods) {
                    if (method.startsWith("org.springframework.web.bind.annotation.RequestMethod.")) {
                        methodSet.add(method.substring("org.springframework.web.bind.annotation.RequestMethod.".length()).toLowerCase());
                    }
                }
            }
        }
        return methodSet;
    }

    private Set<String> getProduces(ReflectAnnotation requestMapping) {
        Set<String> produces = new HashSet();
        if (requestMapping != null) {
            if (requestMapping.has("produces")) {
                String[] mimes = requestMapping.getArray("produces");
                if (mimes != null) {
                    for (String mime : mimes) {
                        produces.add(mime);
                    }
                }
            }
        }
        return produces;
    }

    private Set<String> getCondumes(ReflectAnnotation requestMapping) {
        Set<String> produces = new HashSet();
        if (requestMapping != null) {
            if (requestMapping.has("consumes")) {
                String[] mimes = requestMapping.getArray("consumes");
                if (mimes != null) {
                    for (String mime : mimes) {
                        produces.add(mime);
                    }
                }
            }
        }
        return produces;
    }

}
