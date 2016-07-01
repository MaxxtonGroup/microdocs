package com.maxxton.microdocs.crawler.core.domain.schema;

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
