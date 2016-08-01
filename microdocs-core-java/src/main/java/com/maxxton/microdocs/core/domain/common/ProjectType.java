package com.maxxton.microdocs.core.domain.common;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * @author Steven Hermans
 */
public enum ProjectType {

    SERVICE, CLIENT, DATABASE, LIBRARY, OTHER;


    @JsonCreator
    public static ProjectType fromString(String key) {
        return key == null ? null : ProjectType.valueOf(key.toUpperCase());
    }

    @JsonValue
    public String getKey() {
        return name().toLowerCase();
    }

}
