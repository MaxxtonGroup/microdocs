package com.maxxton.microdocs.core.domain.schema;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.maxxton.microdocs.core.domain.JsonReference;

/**
 * @author Steven Hermans
 */
public abstract class Schema extends JsonReference {

    private SchemaType type;
    private String format;
    @JsonProperty("default")
    private Object defaultValue;
    private String description;
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean required = false;
    private Number multipleOf;
    private Number maximum;
    private Number minimum;
    private Number exclusiveMaximum;
    private Number inclusiveMinimum;
    private Integer maxLength;
    private Integer minLength;
    private String pattern;
    private Integer maxItems;
    private Integer minItems;
    private Integer uniqueItems;
    private Integer maxProperties;
    private Integer minProperties;
    private SchemaMappings mappings;

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public SchemaType getType() {
        return type;
    }

    public void setType(SchemaType type) {
        this.type = type;
    }

    public Object getDefaultValue() {
        return defaultValue;
    }

    public Schema setDefaultValue(Object defaultValue) {
        this.defaultValue = defaultValue;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public Number getMultipleOf() {
        return multipleOf;
    }

    public void setMultipleOf(Number multipleOf) {
        this.multipleOf = multipleOf;
    }

    public Number getMaximum() {
        return maximum;
    }

    public void setMaximum(Number maximum) {
        this.maximum = maximum;
    }

    public Number getMinimum() {
        return minimum;
    }

    public void setMinimum(Number minimum) {
        this.minimum = minimum;
    }

    public Number getExclusiveMaximum() {
        return exclusiveMaximum;
    }

    public void setExclusiveMaximum(Number exclusiveMaximum) {
        this.exclusiveMaximum = exclusiveMaximum;
    }

    public Number getInclusiveMinimum() {
        return inclusiveMinimum;
    }

    public void setInclusiveMinimum(Number inclusiveMinimum) {
        this.inclusiveMinimum = inclusiveMinimum;
    }

    public Integer getMaxLength() {
        return maxLength;
    }

    public void setMaxLength(Integer maxLength) {
        this.maxLength = maxLength;
    }

    public Integer getMinLength() {
        return minLength;
    }

    public void setMinLength(Integer minLength) {
        this.minLength = minLength;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public Integer getMaxItems() {
        return maxItems;
    }

    public void setMaxItems(Integer maxItems) {
        this.maxItems = maxItems;
    }

    public Integer getMinItems() {
        return minItems;
    }

    public void setMinItems(Integer minItems) {
        this.minItems = minItems;
    }

    public Integer getUniqueItems() {
        return uniqueItems;
    }

    public void setUniqueItems(Integer uniqueItems) {
        this.uniqueItems = uniqueItems;
    }

    public Integer getMaxProperties() {
        return maxProperties;
    }

    public void setMaxProperties(Integer maxProperties) {
        this.maxProperties = maxProperties;
    }

    public Integer getMinProperties() {
        return minProperties;
    }

    public void setMinProperties(Integer minProperties) {
        this.minProperties = minProperties;
    }

    public SchemaMappings getMappings() {
        return mappings;
    }

    public void setMappings(SchemaMappings mappings) {
        this.mappings = mappings;
    }
}
