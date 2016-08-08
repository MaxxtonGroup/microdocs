package com.maxxton.microdocs.core.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Steven Hermans
 */
public class JsonReference {

    @JsonProperty("$ref")
    private String reference;

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }
}
