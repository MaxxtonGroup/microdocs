package com.maxxton.microdocs.crawler.spring;

import com.maxxton.microdocs.core.builder.ComponentBuilder;
import com.maxxton.microdocs.core.collector.ComponentCollector;
import com.maxxton.microdocs.core.collector.SchemaCollector;
import com.maxxton.microdocs.core.domain.component.ComponentType;
import com.maxxton.microdocs.crawler.Crawler;
import com.maxxton.microdocs.crawler.spring.collector.PathCollector;
import com.maxxton.microdocs.crawler.spring.collector.SpringSchemaCollector;
import com.maxxton.microdocs.core.builder.ProjectBuilder;
import com.maxxton.microdocs.core.domain.Project;
import com.maxxton.microdocs.core.domain.schema.Schema;
import com.maxxton.microdocs.core.reflect.ReflectClass;
import com.maxxton.microdocs.crawler.spring.collector.DependencyCollector;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class SpringCrawler extends Crawler {

    private static final String TYPE_SERVICE = "org.springframework.stereotype.Service";
    private static final String TYPE_COMPONENT = "org.springframework.stereotype.Component";
    private static final String TYPE_CONTROLLER = "org.springframework.stereotype.Controller";
    private static final String TYPE_REST_CONTROLLER = "org.springframework.web.bind.annotation.RestController";
    private static final String TYPE_REPOSITORY = "org.springframework.stereotype.Repository";
    private static final String TYPE_SPRING_BOOT_APPLICATION = "org.springframework.boot.autoconfigure.SpringBootApplication";
    private static final String TYPE_CONFIGURATION = "org.springframework.context.annotation.Configuration";
    private static final String TYPE_FEIGN_CLIENT = "org.springframework.cloud.netflix.feign.FeignClient";

    private static final String TYPE_REQUEST_MAPPING = "org.springframework.web.bind.annotation.RequestMapping";


    private final ComponentCollector componentCollector;
    private final SchemaCollector schemaCollector;
    private final PathCollector pathCollector;
    private final DependencyCollector dependencyCollector;

    public SpringCrawler() {
        Map componentsMap = new HashMap();
        componentsMap.put(TYPE_SERVICE, ComponentType.SERVICE);
        componentsMap.put(TYPE_COMPONENT, ComponentType.COMPONENT);
        componentsMap.put(TYPE_CONTROLLER, ComponentType.CONTROLLER);
        componentsMap.put(TYPE_REST_CONTROLLER, ComponentType.CONTROLLER);
        componentsMap.put(TYPE_REPOSITORY, ComponentType.REPOSITORY);
        componentsMap.put(TYPE_SPRING_BOOT_APPLICATION, ComponentType.APPLICATION);
        componentsMap.put(TYPE_CONFIGURATION, ComponentType.CONFIGURATION);
        componentsMap.put(TYPE_FEIGN_CLIENT, ComponentType.CLIENT);
        componentCollector = new ComponentCollector(componentsMap);

        schemaCollector = new SpringSchemaCollector();
        pathCollector = new PathCollector(schemaCollector, new String[]{TYPE_REST_CONTROLLER}, TYPE_REQUEST_MAPPING);
        dependencyCollector = new DependencyCollector(schemaCollector, TYPE_FEIGN_CLIENT, TYPE_REQUEST_MAPPING);
    }

    @Override
    protected Project extractProject(ProjectBuilder project, List<ReflectClass<?>> classes) {
        // extract components
        List<ComponentBuilder> components = componentCollector.collect(classes);
        components.forEach(component -> project.component(component.simpleName(), component.build()));

        // extract endpoint
        pathCollector.collect(classes).forEach(pathBuilder -> project.path(pathBuilder));

        // extract depenencies
        dependencyCollector.collect(classes).forEach(dependencyBuilder -> project.dependency(dependencyBuilder));

        // extract schemas
        Map<String, Schema> schemas = schemaCollector.collect(classes);
        schemas.entrySet().forEach(entry -> project.definition(entry.getKey(), entry.getValue()));

        return project.build();
    }
}
