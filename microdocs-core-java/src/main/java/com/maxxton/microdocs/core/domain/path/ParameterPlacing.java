package com.maxxton.microdocs.core.domain.path;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * @author Steven Hermans
 */
public enum ParameterPlacing {

    QUERY, HEADER, PATH, FORMDATA, BODY;


    @JsonCreator
    public static ParameterPlacing fromString(String key) {
        return key == null ? null : ParameterPlacing.valueOf(key.toUpperCase());
    }

    @JsonValue
    public String getKey() {
        return name().toLowerCase();
    }

}
