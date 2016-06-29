package com.maxxton.microdocs.crawler.core.domain.component;

import com.maxxton.microdocs.crawler.core.domain.JsonReference;

import java.util.Map;

/**
 * @author Steven Hermans
 */
public class Annotation extends JsonReference {

    private String name;
    private Map<String, Object> properties;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }
}
