package com.maxxton.microdocs.crawler.core.builder;

import com.maxxton.microdocs.crawler.core.domain.component.Component;
import com.maxxton.microdocs.crawler.core.domain.path.Parameter;
import com.maxxton.microdocs.crawler.core.domain.path.Path;
import com.maxxton.microdocs.crawler.core.domain.path.Response;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @author Steven Hermans
 */
public class PathBuilder implements Builder<Path> {

    private Path endpoint = new Path();
    private String path;
    private String method;

    @Override
    public Path build() {
        return endpoint;
    }

    public PathBuilder path(String path) {
        this.path = path;
        return this;
    }

    public String path() {
        return path;
    }

    public PathBuilder method(String method) {
        this.method = method;
        return this;
    }

    public String method() {
        return this.method;
    }

    public PathBuilder component(ReflectClass controller) {
        return component(controller.getSimpleName());
    }

    public PathBuilder component(String controllerName) {
        Component component = new Component();
        component.setReference("#/components/" + controllerName);
        endpoint.setController(component);
        return this;
    }

    public PathBuilder tags(String... tags) {
        List<String> tagList = new ArrayList();
        for (String tag : tags) {
            tagList.add(tag);
        }
        return tags(tagList);
    }

    public PathBuilder tags(List<String> tagList) {
        endpoint.setTags(tagList);
        return this;
    }

    public PathBuilder summary(String summary) {
        endpoint.setSummary(summary);
        return this;
    }

    public PathBuilder description(String description) {
        endpoint.setDescription(description);
        return this;
    }

    public PathBuilder operationId(String operationId) {
        endpoint.setOperationId(operationId);
        return this;
    }

    public PathBuilder consumes(String... consumes) {
        List<String> consumesList = new ArrayList();
        for (String consume : consumes) {
            consumesList.add(consume);
        }
        return consumes(consumesList);
    }

    public PathBuilder consumes(List<String> consumes) {
        endpoint.setConsumes(consumes);
        return this;
    }

    public PathBuilder produces(String... produces) {
        List<String> produceList = new ArrayList();
        for (String produce : produces) {
            produceList.add(produce);
        }
        return produces(produceList);
    }

    public PathBuilder produces(List<String> produces) {
        endpoint.setProduces(produces);
        return this;
    }

    public PathBuilder parameter(Parameter parameter) {
        endpoint.getParameters().add(parameter);
        return this;
    }

    public PathBuilder parameters(List<Parameter> parameters) {
        endpoint.setParameters(parameters);
        return this;
    }

    public PathBuilder response(Response response) {
        if(endpoint.getResponses() == null){
            endpoint.setResponses(new HashMap());
        }
        endpoint.getResponses().put("default", response);
        return this;
    }
}
