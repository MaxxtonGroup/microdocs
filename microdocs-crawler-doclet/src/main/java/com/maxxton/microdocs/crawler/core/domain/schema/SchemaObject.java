package com.maxxton.microdocs.crawler.core.domain.schema;

import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class SchemaObject extends Schema {

    private Map<String, Schema> properties;
    private List<Schema> allOf;
    private String name;
    private String simpleName;
    private String genericName;
    private String genericSimpleName;

    public SchemaObject() {
        setType(SchemaType.OBJECT);
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

    public String getSimpleName() {
        return simpleName;
    }

    public void setSimpleName(String simpleName) {
        this.simpleName = simpleName;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getGenericSimpleName() {
        return genericSimpleName;
    }

    public void setGenericSimpleName(String genericSimpleName) {
        this.genericSimpleName = genericSimpleName;
    }
}
