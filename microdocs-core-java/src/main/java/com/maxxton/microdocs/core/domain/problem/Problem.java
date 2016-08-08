package com.maxxton.microdocs.core.domain.problem;

import com.maxxton.microdocs.core.domain.common.SecurityDefinition;
import com.maxxton.microdocs.core.domain.component.Component;
import com.maxxton.microdocs.core.domain.path.ParameterBody;
import com.maxxton.microdocs.core.domain.path.ParameterVariable;
import com.maxxton.microdocs.core.domain.path.Path;
import com.maxxton.microdocs.core.domain.path.Response;
import com.maxxton.microdocs.core.domain.schema.Schema;
import com.maxxton.microdocs.core.domain.dependency.Dependency;

/**
 * @author Steven Hermans
 */
public class Problem {

    private ProblemLevel level;
    private String description;

    private SecurityDefinition securityDefinition;
    private Path path;
    private Schema schema;
    private ParameterBody parameterBody;
    private ParameterVariable parameterVariable;
    private Response response;
    private Component component;
    private Dependency dependency;

    public ProblemLevel getLevel() {
        return level;
    }

    public void setLevel(ProblemLevel level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public SecurityDefinition getSecurityDefinition() {
        return securityDefinition;
    }

    public void setSecurityDefinition(SecurityDefinition securityDefinition) {
        this.securityDefinition = securityDefinition;
    }

    public Path getPath() {
        return path;
    }

    public void setPath(Path path) {
        this.path = path;
    }

    public Schema getSchema() {
        return schema;
    }

    public void setSchema(Schema schema) {
        this.schema = schema;
    }

    public ParameterBody getParameterBody() {
        return parameterBody;
    }

    public void setParameterBody(ParameterBody parameterBody) {
        this.parameterBody = parameterBody;
    }

    public ParameterVariable getParameterVariable() {
        return parameterVariable;
    }

    public void setParameterVariable(ParameterVariable parameterVariable) {
        this.parameterVariable = parameterVariable;
    }

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    public Component getComponent() {
        return component;
    }

    public void setComponent(Component component) {
        this.component = component;
    }

    public Dependency getDependency() {
        return dependency;
    }

    public void setDependency(Dependency dependency) {
        this.dependency = dependency;
    }
}
