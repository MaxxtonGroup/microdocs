package com.maxxton.microdocs.crawler.spring.collector;

import com.maxxton.microdocs.crawler.core.collector.SchemaCollector;
import com.maxxton.microdocs.crawler.core.domain.path.Parameter;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;
import com.maxxton.microdocs.crawler.core.reflect.ReflectMethod;
import com.maxxton.microdocs.crawler.core.reflect.ReflectParameter;

import java.util.List;

/**
 * @author Steven Hermans
 */
public interface RequestParser {

    public String getClassName();

    public List<Parameter> parse(ReflectParameter reflectParameter, ReflectClass controller, ReflectMethod method, SchemaCollector schemaCollector);

}
