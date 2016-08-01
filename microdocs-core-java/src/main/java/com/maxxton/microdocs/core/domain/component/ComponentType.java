package com.maxxton.microdocs.core.domain.component;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * @author Steven Hermans
 */
public enum ComponentType {

    APPLICATION,
    SERVICE,
    CONTROLLER,
    CLIENT,
    REPOSITORY,
    CONFIGURATION,
    COMPONENT;


    @JsonCreator
    public static ComponentType fromString(String key) {
        return key == null ? null : ComponentType.valueOf(key.toUpperCase());
    }

    @JsonValue
    public String getKey() {
        return name().toLowerCase();
    }

}
