package com.maxxton.microdocs.crawler.core.collector;

import com.maxxton.microdocs.crawler.core.domain.schema.Schema;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;
import com.maxxton.microdocs.crawler.core.reflect.ReflectGenericClass;

import java.util.List;

/**
 * @author Steven Hermans
 */
public interface SchemaParser {

    public String getClassName();

    public Schema parse(ReflectClass reflectClass, List<ReflectGenericClass> genericClasses, SchemaCollector collector);

}
