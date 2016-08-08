package com.maxxton.microdocs.core.builder;

import com.maxxton.microdocs.core.domain.component.Component;
import com.maxxton.microdocs.core.domain.dependency.Dependency;
import com.maxxton.microdocs.core.domain.dependency.DependencyType;
import com.maxxton.microdocs.core.domain.path.Path;
import com.maxxton.microdocs.core.reflect.ReflectClass;

import java.util.HashMap;

/**
 * Build dependency
 * @author Steven Hermans
 */
public class DependencyBuilder implements Builder<Dependency> {

    private String title;
    private Dependency dependency = new Dependency();

    public String title(){
        return title;
    }

    public DependencyBuilder title(String title){
        this.title = title.toLowerCase();
        return this;
    }

    public DependencyBuilder path(PathBuilder pathBuilder){
        path(pathBuilder.path(), pathBuilder.requestMethod(), pathBuilder.build());
        return this;
    }

    public DependencyBuilder path(String path, String method, Path endpoint){
        if(dependency.getPaths() == null){
            dependency.setPaths(new HashMap());
        }
        if(dependency.getPaths().get(path) == null){
            dependency.getPaths().put(path, new HashMap());
        }
        dependency.getPaths().get(path).put(method, endpoint);
        return this;
    }

    public DependencyBuilder group(String group){
        dependency.setGroup(group);
        return this;
    }

    public DependencyBuilder description(String description){
        dependency.setDescription(description);
        return this;
    }

    public DependencyBuilder component(ReflectClass controller) {
        return component(controller.getSimpleName());
    }

    public DependencyBuilder component(String controllerName) {
        Component component = new Component();
        component.setReference("#/components/" + controllerName);
        dependency.setComponent(component);
        return this;
    }

    public DependencyBuilder type(DependencyType type){
        dependency.setType(type);
        return this;
    }

    public DependencyBuilder version(String version){
        dependency.setVersion(version);
        return this;
    }

    public DependencyBuilder latestVersion(String latestVersion){
        dependency.setLatestVersion(latestVersion);
        return this;
    }

    public DependencyBuilder protocol(String protocol){
        dependency.setProtocol(protocol);
        return this;
    }


    @Override
    public Dependency build() {
        return dependency;
    }
}
