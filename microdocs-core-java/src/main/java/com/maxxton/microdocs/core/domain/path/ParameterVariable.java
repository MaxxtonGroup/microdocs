package com.maxxton.microdocs.core.domain.path;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.maxxton.microdocs.core.domain.schema.SchemaArray;

import java.util.List;

/**
 * @author Steven Hermans
 */
public class ParameterVariable extends SchemaArray implements Parameter {

    private String name;
    private ParameterPlacing in;
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean allowEmptyValue = false;
    @JsonProperty("enum")
    private List enums;

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public ParameterPlacing getIn() {
        return in;
    }

    @Override
    public void setIn(ParameterPlacing in) {
        this.in = in;
    }

    public boolean isAllowEmptyValue() {
        return allowEmptyValue;
    }

    public void setAllowEmptyValue(boolean allowEmptyValue) {
        this.allowEmptyValue = allowEmptyValue;
    }

    public List getEnums() {
        return enums;
    }

    public void setEnums(List enums) {
        this.enums = enums;
    }
}
