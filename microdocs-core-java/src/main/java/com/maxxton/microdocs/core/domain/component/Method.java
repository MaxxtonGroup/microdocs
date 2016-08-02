package com.maxxton.microdocs.core.domain.component;

import com.maxxton.microdocs.core.domain.JsonReference;

import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class Method extends JsonReference {

    private String name;
    private String description;
    private List<String> parameters;
    private Integer lineNumber;
    private Component component;
    private Map<String, Annotation> annotations;
    private List<ComponentLink> links;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getParameters() {
        return parameters;
    }

    public void setParameters(List<String> parameters) {
        this.parameters = parameters;
    }

    public Integer getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(Integer lineNumber) {
        this.lineNumber = lineNumber;
    }

    public Component getComponent() {
        return component;
    }

    public void setComponent(Component component) {
        this.component = component;
    }

    public Map<String, Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(Map<String, Annotation> annotations) {
        this.annotations = annotations;
    }

    public List<ComponentLink> getLinks() {
        return links;
    }

    public void setLinks(List<ComponentLink> links) {
        this.links = links;
    }
}
