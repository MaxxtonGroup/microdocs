package com.maxxton.microdocs.crawler.core;

import com.maxxton.microdocs.crawler.core.builder.ProjectBuilder;
import com.maxxton.microdocs.crawler.core.domain.Project;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;

import java.util.List;

/**
 * Crawls classes and extract the project information
 * @author Steven Hermans
 */
public abstract class Crawler {

    /**
     * Extract project information from the classes
     * @param classes list of ReflectClasses
     * @return extracted project
     */
    public Project crawl(List<ReflectClass<?>> classes){
        //start builder
        ProjectBuilder projectBuilder = new ProjectBuilder();
        classes.forEach(clazz -> projectBuilder.projectClass(clazz.getName()));

        //extract project information
        return extractProject(projectBuilder, classes);
    }

    /**
     * Handles the extraction of the project information
     * @param projectBuilder builder of the project
     * @param classes list of ReflectClasses
     * @return extracted project
     * @throws Exception
     */
    protected abstract Project extractProject(ProjectBuilder projectBuilder, List<ReflectClass<?>> classes);

}
