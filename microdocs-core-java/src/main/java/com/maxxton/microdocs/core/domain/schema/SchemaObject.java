package com.maxxton.microdocs.core.domain.schema;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class SchemaObject extends Schema {

    private Map<String, Schema> properties;
    private List<Schema> allOf;
    private String name;
    private List<SchemaGenericObject> generic;
    @JsonIgnore
    private boolean ignore;

    public SchemaObject() {

    }

    public Map<String, Schema> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Schema> properties) {
        this.properties = properties;
    }

    public List<Schema> getAllOf() {
        return allOf;
    }

    public void setAllOf(List<Schema> allOf) {
        this.allOf = allOf;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SchemaGenericObject> getGeneric() {
        return generic;
    }

    public void setGeneric(List<SchemaGenericObject> generic) {
        this.generic = generic;
    }

    public boolean isIgnore() {
        return ignore;
    }

    public void setIgnore(boolean ignore) {
        this.ignore = ignore;
    }
}
