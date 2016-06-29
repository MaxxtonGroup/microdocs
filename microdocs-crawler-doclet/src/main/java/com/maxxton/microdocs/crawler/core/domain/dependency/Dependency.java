package com.maxxton.microdocs.crawler.core.domain.dependency;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.maxxton.microdocs.crawler.core.domain.common.ProjectType;
import com.maxxton.microdocs.crawler.core.domain.path.Path;
import com.maxxton.microdocs.crawler.core.domain.JsonReference;

import java.util.Map;

/**
 * @author Steven Hermans
 */
public class Dependency extends JsonReference{

    private String description;
    private String group;
    private ProjectType type;
    private String protocol;
    @JsonProperty("import")
    private DependencyImport dependencyImport;
    private Map<String, Map<String, Path>> paths;

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

    public ProjectType getType() {
        return type;
    }

    public void setType(ProjectType type) {
        this.type = type;
    }

    public DependencyImport getDependencyImport() {
        return dependencyImport;
    }

    public void setDependencyImport(DependencyImport dependencyImport) {
        this.dependencyImport = dependencyImport;
    }
}
