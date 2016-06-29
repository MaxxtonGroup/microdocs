package com.maxxton.microdocs.crawler.spring;

import com.maxxton.microdocs.crawler.core.Crawler;
import com.maxxton.microdocs.crawler.core.builder.ComponentBuilder;
import com.maxxton.microdocs.crawler.core.builder.ProjectBuilder;
import com.maxxton.microdocs.crawler.core.domain.Project;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;
import com.maxxton.microdocs.crawler.core.collector.ComponentCollector;
import com.maxxton.microdocs.crawler.core.domain.component.ComponentType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class SpringCrawler extends Crawler{

    private final ComponentCollector componentCollector;

    public SpringCrawler(){
        Map componentsMap = new HashMap();
        componentsMap.put("", ComponentType.COMPONENT);
        componentCollector = new ComponentCollector(componentsMap);
    }

    @Override
    protected Project extractProject(ProjectBuilder project, List<ReflectClass> classes) {
        // extract components
        List<ComponentBuilder> components = componentCollector.collect(classes);
        components.forEach(component -> project.component(component.simpleName(), component.build()));


        return project.build();
    }
}
