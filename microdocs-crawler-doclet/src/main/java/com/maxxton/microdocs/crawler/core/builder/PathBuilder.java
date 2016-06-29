package com.maxxton.microdocs.crawler.core.builder;

import com.maxxton.microdocs.crawler.core.domain.path.Path;

/**
 * @author Steven Hermans
 */
public class PathBuilder implements Builder<Path>{

    private Path endpoint = new Path();
    private String path;
    private String method;

    @Override
    public Path build(){
        return endpoint;
    }

    public PathBuilder path(String path){
        this.path = path;
        return this;
    }

    public String path(){
        return path;
    }

    public PathBuilder method(String method){
        this.method = method;
        return this;
    }

    public String method(){
        return this.method;
    }

}
