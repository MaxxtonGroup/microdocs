package com.maxxton.microdocs.publisher;

/**
 * @author Steven Hermans
 */
public class ServerConfiguration {

    private final String url;

    public ServerConfiguration(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }
}
