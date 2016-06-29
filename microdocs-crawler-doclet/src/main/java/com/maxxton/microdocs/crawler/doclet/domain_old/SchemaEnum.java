package com.maxxton.microdocs.crawler.doclet.domain_old;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Created by hermans.s on 20-5-2016.
 */
public class SchemaEnum extends Schema {

    @JsonProperty("enum")
    private List<String> items;

    public SchemaEnum(List<String> items, ClassType classType) {
        super(Schema.ENUM, classType);
        this.items = items;
    }

    public SchemaEnum(List<String> items, ClassType classType, boolean required) {
        super(Schema.ENUM, classType, required);
        this.items = items;
    }

    public List<String> getItems() {
        return items;
    }
}
