package com.maxxton.microdocs.crawler.doclet_old.domain_old;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by hermans.s on 20-5-2016.
 */
public class SchemaReference extends Schema {

    private final String reference;

    public SchemaReference(ClassType classType) {
        super(Schema.OBJECT, classType);
        reference = classType.getName();
    }

    public SchemaReference(ClassType classType, boolean required) {
        super(Schema.OBJECT, classType, required);
        reference = classType.getName();
    }

    @JsonIgnore
    public String getType() {
        return super.getType();
    }

    @JsonIgnore
    public boolean isRequired() {
        return super.isRequired();
    }

    @JsonIgnore
    public ClassType getClassType() {
        return super.getClassType();
    }

    @JsonIgnore
    public String getDescription(){
        return super.getDescription();
    }

    @JsonProperty("$ref")
    public String getReference() {
        return reference;
    }
}
