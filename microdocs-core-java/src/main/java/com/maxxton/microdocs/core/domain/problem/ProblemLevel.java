package com.maxxton.microdocs.core.domain.problem;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * @author Steven Hermans
 */
public enum ProblemLevel {

    NOTICE,
    WARNING,
    ERROR;

    @JsonCreator
    public static ProblemLevel fromString(String key) {
        return key == null ? null : ProblemLevel.valueOf(key.toUpperCase());
    }

    @JsonValue
    public String getKey() {
        return name().toLowerCase();
    }

}
