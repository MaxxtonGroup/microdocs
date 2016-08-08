package com.maxxton.microdocs.core.domain.schema;

/**
 * @author Steven Hermans
 */
public class SchemaArray extends Schema{

    private Schema items;
    private String collectionFormat;

    public SchemaArray(){
    }

    public SchemaArray(Schema items) {
        super();
        this.items = items;
    }

    public Schema getItems() {
        return items;
    }

    public void setItems(Schema items) {
        this.items = items;
    }

    public String getCollectionFormat() {
        return collectionFormat;
    }

    public void setCollectionFormat(String collectionFormat) {
        this.collectionFormat = collectionFormat;
    }
}
