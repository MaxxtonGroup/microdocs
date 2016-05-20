package org.springdoclet.domain;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author hermans.s
 */
public class Endpoint {

    private String method;
    private String path;
    private List<Variable> pathVariables = new ArrayList();
    private List<Field> requestParams = new ArrayList();
    private Schema requestBody;
    private Schema responseBody;
    private String description;

    public Endpoint(String method, String path) {
        this.method = method;
        this.path = path;
    }
    
    public void addRequestParam(Field field){
        requestParams.add(field);
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<Field> getRequestParams() {
        return requestParams;
    }

    public void setRequestParams(List<Field> requestParams) {
        this.requestParams = requestParams;
    }

    public Schema getRequestBody() {
        return requestBody;
    }

    public void setRequestBody(Schema requestBody) {
        this.requestBody = requestBody;
    }

    public Schema getResponseBody() {
        return responseBody;
    }

    public void setResponseBody(Schema responseBody) {
        this.responseBody = responseBody;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void addRequestParam(String name, Schema schema, String description, String defaultValue, boolean required){
        this.requestParams.add(new Field(name, schema, description, defaultValue, required));
    }

    public void addPathVariable(String name, Schema schema, String description){
        this.pathVariables.add(new Variable(name, schema, description));
    }

    public void addPathVariable(Variable variable){
        this.pathVariables.add(variable);
    }

    public List<Variable> getPathVariables() {
        return pathVariables;
    }

    public void setPathVariables(List<Variable> pathVariables) {
        this.pathVariables = pathVariables;
    }
}
