package com.maxxton.microdocs.core.domain.schema;

import java.util.List;

/**
 * @author s.hermans
 */
public class SchemaGenericObject {

    private String name;
    private String simpleName;
    private List<SchemaGenericObject> generic;

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

    public List<SchemaGenericObject> getGeneric() {
        return generic;
    }

    public void setGeneric(List<SchemaGenericObject> generic) {
        this.generic = generic;
    }
}
