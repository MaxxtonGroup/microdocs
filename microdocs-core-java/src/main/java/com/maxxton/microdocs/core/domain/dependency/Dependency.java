package com.maxxton.microdocs.core.domain.dependency;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.maxxton.microdocs.core.domain.JsonReference;
import com.maxxton.microdocs.core.domain.component.Component;
import com.maxxton.microdocs.core.domain.path.Path;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class Dependency extends JsonReference{

    private String description;
    private String group;
    private String version;
    private String latestVersion;
    private DependencyType type;
    private String protocol;
    @JsonProperty("import")
    private DependencyImport dependencyImport;
    private Map<String, Map<String, Path>> paths = new HashMap();
    private Component component;

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public Map<String, Map<String, Path>> getPaths() {
        return paths;
    }

    public void setPaths(Map<String, Map<String, Path>> paths) {
        this.paths = paths;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public DependencyType getType() {
        return type;
    }

    public void setType(DependencyType type) {
        this.type = type;
    }

    public DependencyImport getDependencyImport() {
        return dependencyImport;
    }

    public void setDependencyImport(DependencyImport dependencyImport) {
        this.dependencyImport = dependencyImport;
    }

    public String getLatestVersion() {
        return latestVersion;
    }

    public void setLatestVersion(String latestVersion) {
        this.latestVersion = latestVersion;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Component getComponent() {
        return component;
    }

    public void setComponent(Component component) {
        this.component = component;
    }
}
