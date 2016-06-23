package org.springdoclet;

/**
 *
 * @author hermans.s
 */
public class PathBuilder {

    private String linkUrl;

    public PathBuilder(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public String buildFilePath(String className) {
        return linkUrl + className.replaceAll("\\.", "/") + ".html";
    }

}
