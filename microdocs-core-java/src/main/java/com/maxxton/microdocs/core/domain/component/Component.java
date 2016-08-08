package com.maxxton.microdocs.core.domain.component;

import com.maxxton.microdocs.core.domain.JsonReference;

import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class Component extends JsonReference {

    private String name;
    private ComponentType type;
    private String file;
    private String description;
    private List<String> authors;
    private Map<String, Annotation> annotations;
    private Map<String, Method> methods;
    private List<Component> dependencies;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ComponentType getType() {
        return type;
    }

    public void setType(ComponentType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getAuthors() {
        return authors;
    }

    public void setAuthors(List<String> authors) {
        this.authors = authors;
    }

    public Map<String, Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(Map<String, Annotation> annotations) {
        this.annotations = annotations;
    }

    public Map<String, Method> getMethods() {
        return methods;
    }

    public void setMethods(Map<String, Method> methods) {
        this.methods = methods;
    }

    public List<Component> getDependencies() {
        return dependencies;
    }

    public void setDependencies(List<Component> dependencies) {
        this.dependencies = dependencies;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }
}
