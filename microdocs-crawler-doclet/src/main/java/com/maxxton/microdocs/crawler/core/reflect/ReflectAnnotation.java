package com.maxxton.microdocs.crawler.core.reflect;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class ReflectAnnotation extends ReflectDoc{

    private String packageName;
    private Map<String, Object> properties = new HashMap();

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }
}
