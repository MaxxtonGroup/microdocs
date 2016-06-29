package com.maxxton.microdocs.crawler.core.collector;

import com.maxxton.microdocs.crawler.core.builder.SchemaBuilder;
import com.maxxton.microdocs.crawler.core.domain.schema.Schema;
import com.maxxton.microdocs.crawler.core.domain.schema.SchemaObject;
import com.maxxton.microdocs.crawler.core.reflect.ReflectClass;
import com.maxxton.microdocs.crawler.core.reflect.ReflectGenericClass;
import com.maxxton.microdocs.crawler.doclet.domain_old.SchemaReference;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class SchemaCollector implements Collector<SchemaBuilder> {

    private Map<String, ReflectClass> models = new HashMap();

    @Override
    public List<SchemaBuilder> collect(List<ReflectClass> classes) {

    }

    public Schema collect(ReflectClass reflectClass){
        models.put(reflectClass.getName(), reflectClass);
        Schema schema = new SchemaObject();
        schema.setReference(reflectClass.getName());
        return schema;
    }

    public SchemaBuilder collect(ReflectGenericClass reflectGenericClass){

    }

    private SchemaBuilder collectModel(ReflectClass reflectClass){

    }


}
