package com.maxxton.microdocs.crawler.core.domain.path;

import com.maxxton.microdocs.crawler.core.domain.component.Component;
import com.maxxton.microdocs.crawler.core.domain.JsonReference;

import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class Path extends JsonReference{

    private Component controller;
    private List<String> tags;
    private String summary;
    private String description;
    private String operationId;
    private List<String> consumes;
    private List<String> produces;
    private Map<String, Parameter> parameters;
    private Map<String, Response> responses;
    private Map<String, List<String>> security;
    private boolean deprecated;

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

    public Map<String, Parameter> getParameters() {
        return parameters;
    }

    public void setParameters(Map<String, Parameter> parameters) {
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
}
