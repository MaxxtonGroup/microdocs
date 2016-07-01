package com.maxxton.microdocs.crawler.spring.collector;

import com.maxxton.microdocs.crawler.core.builder.DependencyBuilder;
import com.maxxton.microdocs.crawler.core.builder.PathBuilder;
import com.maxxton.microdocs.crawler.core.collector.Collector;
import com.maxxton.microdocs.crawler.core.collector.SchemaCollector;
import com.maxxton.microdocs.crawler.core.domain.dependency.DependencyType;
import com.maxxton.microdocs.crawler.core.domain.path.Path;
import com.maxxton.microdocs.crawler.core.reflect.ReflectAnnotation;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;
import com.maxxton.microdocs.crawler.doclet.ErrorReporter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class DependencyCollector implements Collector<DependencyBuilder> {

    private final SchemaCollector schemaCollector;
    private final PathCollector pathCollector;
    private final String feignClient;
    private final String requestMapping;

    public DependencyCollector(SchemaCollector schemaCollector, String feignClient, String requestMapping) {
        this.schemaCollector = schemaCollector;
        this.feignClient = feignClient;
        this.requestMapping = requestMapping;
        pathCollector = new PathCollector(schemaCollector, feignClient, requestMapping);
    }

    @Override
    public List<DependencyBuilder> collect(List<ReflectClass<?>> classes) {
        List<DependencyBuilder> dependencyBuilders = new ArrayList();
        classes.stream().filter(reflectClass -> reflectClass.hasAnnotation(feignClient)).forEach(client -> {
            ErrorReporter.printNotice("Crawl client: " + client.getSimpleName());
            dependencyBuilders.add(collect(client));
        });
        return dependencyBuilders;
    }

    private DependencyBuilder collect(ReflectClass<?> client) {
        DependencyBuilder dependencyBuilder = new DependencyBuilder();
        // collect dependency information
        ReflectAnnotation annotation = client.getAnnotation(feignClient);
        if (annotation != null) {
            if (annotation.getString("value") != null) {
                dependencyBuilder.title(annotation.getString("value"));
            } else if (annotation.getString("name") != null) {
                dependencyBuilder.title(annotation.getString("name"));
            } else if (annotation.getString("serviceId") != null) {
                dependencyBuilder.title(annotation.getString("serviceId"));
            }
        }
        dependencyBuilder.description(client.getDescription().getText());
        dependencyBuilder.component(client);
        dependencyBuilder.type(DependencyType.REST);

        // collect paths
        List<ReflectClass<?>> clients = new ArrayList();
        clients.add(client);
        List<PathBuilder> pathBuilders = pathCollector.collect(clients);
        pathBuilders.forEach(builder -> dependencyBuilder.path(builder));
        System.out.println("Client: " + client.getSimpleName());
        if(dependencyBuilder.build().getPaths() == null){
            System.out.println("  null");
        }else {
            for (Map.Entry<String, Map<String, Path>> path : dependencyBuilder.build().getPaths().entrySet()) {
                System.out.println("  " + path.getKey());
                if (path.getValue() == null) {
                    System.out.println("    null");
                } else {
                    for (Map.Entry<String, Path> method : path.getValue().entrySet()) {
                        System.out.println("    " + method.getKey());
                        System.out.println("       " + method.getValue());
                    }
                }
            }
        }

        return dependencyBuilder;
    }

}
