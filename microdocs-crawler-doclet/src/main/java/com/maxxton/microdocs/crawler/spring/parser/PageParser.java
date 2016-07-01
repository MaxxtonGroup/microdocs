package com.maxxton.microdocs.crawler.spring.parser;

import com.maxxton.microdocs.crawler.core.collector.SchemaCollector;
import com.maxxton.microdocs.crawler.core.collector.SchemaParser;
import com.maxxton.microdocs.crawler.core.domain.schema.*;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;
import com.maxxton.microdocs.crawler.core.reflect.ReflectGenericClass;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class PageParser implements SchemaParser {

    @Override
    public String getClassName() {
        return "org.springframework.data.domain.Page";
    }

    @Override
    public Schema parse(ReflectClass reflectClass, List<ReflectGenericClass> genericClasses, SchemaCollector collector) {
        Schema content;
        if(genericClasses.isEmpty()){
            content = new SchemaObject();
        }else{
            content = collector.collect(genericClasses.get(0));
        }

        SchemaObject schemaObject = new SchemaObject();
        Map<String, Schema> properties = new HashMap();

        properties.put("content", new SchemaArray(content));
        properties.put("last", new SchemaPrimitive(SchemaType.BOOLEAN).setDefaultValue(false));
        properties.put("first", new SchemaPrimitive(SchemaType.BOOLEAN).setDefaultValue(true));
        properties.put("totalPages", new SchemaPrimitive(SchemaType.NUMBER).setDefaultValue(20));
        properties.put("totalElements", new SchemaPrimitive(SchemaType.NUMBER).setDefaultValue(196));
        properties.put("size", new SchemaPrimitive(SchemaType.NUMBER).setDefaultValue(20));
        properties.put("number", new SchemaPrimitive(SchemaType.NUMBER).setDefaultValue(1));
        properties.put("numberOfElements", new SchemaPrimitive(SchemaType.NUMBER).setDefaultValue(20));
        properties.put("sort", new SchemaObject());
        schemaObject.setProperties(properties);
        return schemaObject;
    }

}
