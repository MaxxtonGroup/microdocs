package com.maxxton.microdocs.core.domain.schema;

/**
 * @author Steven Hermans
 */
public class SchemaPrimitive extends Schema {

    public SchemaPrimitive() {
    }

    public SchemaPrimitive(SchemaType type){
        setType(type);
    }
}
