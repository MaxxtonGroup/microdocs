package com.maxxton.microdocs.crawler.spring.collector;

import com.maxxton.microdocs.crawler.core.builder.PathBuilder;
import com.maxxton.microdocs.crawler.core.collector.Collector;
import com.maxxton.microdocs.crawler.core.collector.SchemaCollector;
import com.maxxton.microdocs.crawler.core.domain.path.*;
import com.maxxton.microdocs.crawler.core.domain.schema.Schema;
import com.maxxton.microdocs.crawler.core.reflect.ReflectAnnotation;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;
import com.maxxton.microdocs.crawler.core.reflect.ReflectDescriptionTag;
import com.maxxton.microdocs.crawler.core.reflect.ReflectMethod;

import java.util.*;

/**
 * @author Steven Hermans
 */
public class PathCollector implements Collector<PathBuilder> {

    private final String[] defaultConsumes = new String[]{"application/json", "application/xml"};
    private final String[] defaultProduces = new String[]{"application/json", "application/xml"};

    private static final String TYPE_REQUEST_BODY = "org.springframework.web.bind.annotation.RequestBody";
    private static final String TYPE_REQUEST_PARAM = "org.springframework.web.bind.annotation.RequestParam";
    private static final String TYPE_PATH_VARIABLE = "org.springframework.web.bind.annotation.PathVariable";

    private SchemaCollector schemaCollector;
    private final String restController;
    private final String requestMapping;

    public PathCollector(SchemaCollector schemaCollector, String restController, String requestMapping) {
        this.schemaCollector = schemaCollector;
        this.restController = restController;
        this.requestMapping = requestMapping;
    }

    @Override
    public List<PathBuilder> collect(List<ReflectClass<?>> classes) {
        List<PathBuilder> pathBuilders = new ArrayList();
        classes.stream().filter(reflectClass -> reflectClass.hasAnnotation(restController)).forEach(controller -> {
            controller.getDeclaredMethods().stream().filter(method -> method.hasAnnotation(requestMapping)).forEach(method -> {
                pathBuilders.addAll(collectPaths(controller, method));
            });
        });
        return pathBuilders;
    }

    private List<PathBuilder> collectPaths(ReflectClass<?> controller, ReflectMethod method) {
        ReflectAnnotation controllerRequestMapping = controller.getAnnotation(requestMapping);
        ReflectAnnotation methodRequestMapping = method.getAnnotation(requestMapping);

        // find uri
        String controllerPath = getPath(controllerRequestMapping);
        String methodPath = getPath(methodRequestMapping);
        String fullPath = (controllerPath + methodPath).replace("\\\\", "\\");
        String path;
        if (fullPath.contains("?")) {
            path = fullPath.split("\\?")[0];
            //todo: parse parameters
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
            produces.add(mime);
        }
        produces.addAll(getProduces(controllerRequestMapping));
        produces.addAll(getProduces(methodRequestMapping));

        List<Parameter> parameters = new ArrayList();

        method.getParameters().forEach(parameter -> {
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
        });

        Response response = null;
        if(method.getReturnType() != null && method.getReturnType().getClassType() != null && !method.getReturnType().getClassType().getSimpleName().equalsIgnoreCase("void")){
            response = new Response();
            for(ReflectDescriptionTag tag : method.getDescription().getTags("return")){
                response.setDescription(tag.getKeyword() + " " + tag.getDescription());
                break;
            }
            response.setSchema(schemaCollector.collect(method.getReturnType()));
        }


        // create builders
        List<PathBuilder> pathBuilders = new ArrayList();
        System.out.println(methods.size());
        for (String requestMethod : methods) {
            System.out.println(requestMethod);
            PathBuilder builder = new PathBuilder();
            builder.path(path);
            builder.method(requestMethod);
            builder.component(controller);
            builder.description(method.getDescription().getText());
            builder.operationId(method.getSimpleName());
            builder.parameters(parameters);
            builder.response(response);

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

            System.out.println(requestMapping.get("method"));
            String[] methods = requestMapping.getArray("method");
            if (methods != null) {
                for (String method : methods) {
                    System.out.println(method);
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
