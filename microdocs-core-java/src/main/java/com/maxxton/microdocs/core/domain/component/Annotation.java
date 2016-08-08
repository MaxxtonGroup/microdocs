package com.maxxton.microdocs.core.domain.component;

import com.maxxton.microdocs.core.domain.JsonReference;

import java.util.Map;

/**
 * @author Steven Hermans
 */
public class Annotation extends JsonReference {

    private Map<String, Object> properties;

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }
}
