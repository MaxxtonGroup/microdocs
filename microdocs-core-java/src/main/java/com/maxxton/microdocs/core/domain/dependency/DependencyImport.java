package com.maxxton.microdocs.core.domain.dependency;

/**
 * @author Steven Hermans
 */
public class DependencyImport {

    private String uri;
    private String username;
    private String password;
    private String versioning;
    private String updateInterval;

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getVersioning() {
        return versioning;
    }

    public void setVersioning(String versioning) {
        this.versioning = versioning;
    }

    public String getUpdateInterval() {
        return updateInterval;
    }

    public void setUpdateInterval(String updateInterval) {
        this.updateInterval = updateInterval;
    }
}
