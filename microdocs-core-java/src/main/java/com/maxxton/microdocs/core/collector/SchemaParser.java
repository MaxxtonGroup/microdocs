package com.maxxton.microdocs.core.collector;

import com.maxxton.microdocs.core.domain.schema.Schema;
import com.maxxton.microdocs.core.reflect.ReflectClass;
import com.maxxton.microdocs.core.reflect.ReflectGenericClass;

import java.util.List;

/**
 * @author Steven Hermans
 */
public interface SchemaParser {

    public String getClassName();

    public Schema parse(ReflectClass reflectClass, List<ReflectGenericClass> genericClasses, SchemaCollector collector);

}
