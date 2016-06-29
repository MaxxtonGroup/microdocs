package com.maxxton.microdocs.crawler.core.domain.path;

import com.maxxton.microdocs.crawler.core.domain.JsonReference;
import com.maxxton.microdocs.crawler.core.domain.schema.Schema;

/**
 * @author Steven Hermans
 */
public class ParameterBody extends JsonReference implements Parameter {

    private String name;
    private ParameterPlacing in;
    private String description;
    private boolean required;
    private Schema schema;

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

    @Override
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public Schema getSchema() {
        return schema;
    }

    public void setSchema(Schema schema) {
        this.schema = schema;
    }
}
