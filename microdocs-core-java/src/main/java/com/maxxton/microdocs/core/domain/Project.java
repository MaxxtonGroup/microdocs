package com.maxxton.microdocs.core.domain;

import com.maxxton.microdocs.core.domain.common.ProjectInfo;
import com.maxxton.microdocs.core.domain.common.SecurityDefinition;
import com.maxxton.microdocs.core.domain.common.Tag;
import com.maxxton.microdocs.core.domain.dependency.Dependency;
import com.maxxton.microdocs.core.domain.path.Parameter;
import com.maxxton.microdocs.core.domain.path.Response;
import com.maxxton.microdocs.core.domain.problem.Problem;
import com.maxxton.microdocs.core.domain.component.Component;
import com.maxxton.microdocs.core.domain.path.Path;
import com.maxxton.microdocs.core.domain.schema.Schema;
import com.maxxton.microdocs.core.domain.common.ExternalDocs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Steven Hermans
 */
public class Project {

    private final String swagger = "2.0";
    private ProjectInfo info;
    private String host;
    private String basePath;
    private List<String> schemas;
    private List<Tag> tags;
    private List<ExternalDocs> externalDocs;
    private Map<String, SecurityDefinition> securityDefinitions = new HashMap();
    private Map<String, List<String>> security = new HashMap();
    private List<String> consumes;
    private List<String> produces;
    private Map<String, Map<String, Path>> paths = new HashMap();
    private Map<String, Schema> definitions = new HashMap();
    private Map<String, Parameter> parameters = new HashMap();
    private Map<String, Response> responses = new HashMap();
    private Map<String, Component> components = new HashMap();
    private Map<String, Dependency> dependencies = new HashMap();
    private List<Problem> problems;

    public String getSwagger() {
        return swagger;
    }

    public ProjectInfo getInfo() {
        return info;
    }

    public void setInfo(ProjectInfo info) {
        this.info = info;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getBasePath() {
        return basePath;
    }

    public void setBasePath(String basePath) {
        this.basePath = basePath;
    }

    public List<String> getSchemas() {
        return schemas;
    }

    public void setSchemas(List<String> schemas) {
        this.schemas = schemas;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<ExternalDocs> getExternalDocs() {
        return externalDocs;
    }

    public void setExternalDocs(List<ExternalDocs> externalDocs) {
        this.externalDocs = externalDocs;
    }

    public Map<String, SecurityDefinition> getSecurityDefinitions() {
        return securityDefinitions;
    }

    public void setSecurityDefinitions(Map<String, SecurityDefinition> securityDefinitions) {
        this.securityDefinitions = securityDefinitions;
    }

    public Map<String, List<String>> getSecurity() {
        return security;
    }

    public void setSecurity(Map<String, List<String>> security) {
        this.security = security;
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

    public Map<String, Map<String, Path>> getPaths() {
        return paths;
    }

    public void setPaths(Map<String, Map<String, Path>> paths) {
        this.paths = paths;
    }

    public Map<String, Schema> getDefinitions() {
        return definitions;
    }

    public void setDefinitions(Map<String, Schema> definitions) {
        this.definitions = definitions;
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

    public Map<String, Component> getComponents() {
        return components;
    }

    public void setComponents(Map<String, Component> components) {
        this.components = components;
    }

    public Map<String, Dependency> getDependencies() {
        return dependencies;
    }

    public void setDependencies(Map<String, Dependency> dependencies) {
        this.dependencies = dependencies;
    }

    public List<Problem> getProblems() {
        return problems;
    }

    public void setProblems(List<Problem> problems) {
        this.problems = problems;
    }
}
