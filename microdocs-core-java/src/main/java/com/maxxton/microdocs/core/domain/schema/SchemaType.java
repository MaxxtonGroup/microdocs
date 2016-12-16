package com.maxxton.microdocs.core.domain.schema;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * @author Steven Hermans
 */
public enum SchemaType {

    ENUM,
    OBJECT,
    ARRAY,
    STRING,
    NUMBER,
    INTEGER,
    BOOLEAN,
    DATE,
    DUMMY,
    ANY;

    @JsonCreator
    public static SchemaType fromString(String key) {
        return key == null ? null : SchemaType.valueOf(key.toUpperCase());
    }

    @JsonValue
    public String getKey() {
        return name().toLowerCase();
    }

}
