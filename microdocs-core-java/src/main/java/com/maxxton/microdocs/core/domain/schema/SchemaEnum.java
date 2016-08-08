package com.maxxton.microdocs.core.domain.schema;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * @author Steven Hermans
 */
public class SchemaEnum extends Schema {

    @JsonProperty("enum")
    private List enums;
    private String name;
    private String simpleName;

    public SchemaEnum(){

    }

    public List getEnums() {
        return enums;
    }

    public void setEnums(List enums) {
        this.enums = enums;
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
}
