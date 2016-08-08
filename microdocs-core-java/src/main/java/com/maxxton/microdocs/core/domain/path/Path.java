package com.maxxton.microdocs.core.domain.path;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.maxxton.microdocs.core.domain.JsonReference;
import com.maxxton.microdocs.core.domain.component.Method;
import com.maxxton.microdocs.core.domain.component.Component;

import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class Path extends JsonReference {

    private Component controller;
    private Method method;
    private List<String> tags;
    private String summary;
    private String description;
    private String operationId;
    private List<String> consumes;
    private List<String> produces;
    private List<Parameter> parameters;
    private Map<String, Response> responses;
    private Map<String, List<String>> security;
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean deprecated = false;

    public Component getController() {
        return controller;
    }

    public void setController(Component controller) {
        this.controller = controller;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOperationId() {
        return operationId;
    }

    public void setOperationId(String operationId) {
        this.operationId = operationId;
    }

    public List<String> getConsumes() {
        return consumes;
    }

    public void setConsumes(List<String> consumes) {
        this.consumes = consumes;
    }

    public List<String> getProduces() {
        return produces;
    }

    public void setProduces(List<String> produces) {
        this.produces = produces;
    }

    public List<Parameter> getParameters() {
        return parameters;
    }

    public void setParameters(List<Parameter> parameters) {
        this.parameters = parameters;
    }

    public Map<String, Response> getResponses() {
        return responses;
    }

    public void setResponses(Map<String, Response> responses) {
        this.responses = responses;
    }

    public Map<String, List<String>> getSecurity() {
        return security;
    }

    public void setSecurity(Map<String, List<String>> security) {
        this.security = security;
    }

    public boolean isDeprecated() {
        return deprecated;
    }

    public void setDeprecated(boolean deprecated) {
        this.deprecated = deprecated;
    }

    public Method getMethod() {
        return method;
    }

    public void setMethod(Method method) {
        this.method = method;
    }
}
