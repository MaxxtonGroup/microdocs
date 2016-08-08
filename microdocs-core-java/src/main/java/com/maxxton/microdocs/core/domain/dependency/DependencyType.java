package com.maxxton.microdocs.core.domain.dependency;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * @author Steven Hermans
 */
public enum DependencyType {

    DATABASE, REST, INCLUDES, USES;

    @JsonCreator
    public static DependencyType fromString(String key) {
        return key == null ? null : DependencyType.valueOf(key.toUpperCase());
    }

    @JsonValue
    public String getKey() {
        return name().toLowerCase();
    }

}
