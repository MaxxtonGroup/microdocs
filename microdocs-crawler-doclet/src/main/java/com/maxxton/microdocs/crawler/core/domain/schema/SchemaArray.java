package com.maxxton.microdocs.crawler.core.domain.schema;

/**
 * @author Steven Hermans
 */
public class SchemaArray extends Schema{

    private Schema items;
    private String collectionFormat;

    public Schema getItems() {
        return items;
    }

    public void setItems(Schema items) {
        this.items = items;
    }
}
