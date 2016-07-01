package com.maxxton.microdocs.crawler.spring.parser;

import com.maxxton.microdocs.crawler.core.collector.SchemaCollector;
import com.maxxton.microdocs.crawler.core.collector.SchemaParser;
import com.maxxton.microdocs.crawler.core.domain.schema.Schema;
import com.maxxton.microdocs.crawler.core.domain.schema.SchemaObject;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;
import com.maxxton.microdocs.crawler.core.reflect.ReflectGenericClass;

import java.util.List;

/**
 * @author Steven Hermans
 */
public class ResponseEntityParser implements SchemaParser {

    @Override
    public String getClassName() {
        return "org.springframework.http.ResponseEntity";
    }

    @Override
    public Schema parse(ReflectClass reflectClass, List<ReflectGenericClass> genericClasses, SchemaCollector collector) {
        if(genericClasses.isEmpty()){
            return new SchemaObject();
        }
        return collector.collect(genericClasses.get(0));
    }
}
