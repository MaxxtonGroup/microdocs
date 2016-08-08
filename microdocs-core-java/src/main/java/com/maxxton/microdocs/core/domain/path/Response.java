package com.maxxton.microdocs.core.domain.path;

import com.maxxton.microdocs.core.domain.schema.SchemaArray;
import com.maxxton.microdocs.core.domain.schema.Schema;
import com.maxxton.microdocs.core.domain.JsonReference;

import java.util.Map;

/**
 * @author Steven Hermans
 */
public class Response extends JsonReference {

    private String description;
    private Schema schema;
    private Map<String, SchemaArray> headers;
    private Map<String, String> examples;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Schema getSchema() {
        return schema;
    }

    public void setSchema(Schema schema) {
        this.schema = schema;
    }

    public Map<String, SchemaArray> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, SchemaArray> headers) {
        this.headers = headers;
    }

    public Map<String, String> getExamples() {
        return examples;
    }

    public void setExamples(Map<String, String> examples) {
        this.examples = examples;
    }
}
