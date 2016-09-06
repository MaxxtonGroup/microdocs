package com.maxxton.microdocs.crawler.spring.collector;

import com.maxxton.microdocs.core.builder.SchemaMappingsBuilder;
import com.maxxton.microdocs.core.collector.SchemaCollector;
import com.maxxton.microdocs.core.collector.SchemaParser;
import com.maxxton.microdocs.core.domain.schema.Schema;
import com.maxxton.microdocs.core.domain.schema.SchemaType;
import com.maxxton.microdocs.core.reflect.ReflectAnnotation;
import com.maxxton.microdocs.core.reflect.ReflectClass;
import com.maxxton.microdocs.core.reflect.ReflectDescription;
import com.maxxton.microdocs.core.reflect.ReflectGenericClass;
import com.maxxton.microdocs.crawler.spring.parser.PageParser;
import com.maxxton.microdocs.crawler.spring.parser.ResponseEntityParser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Specific schema collector for JPA and Jackson
 * @author Steven Hermans
 */
public class SpringSchemaCollector extends SchemaCollector {

    private static final String[] SCHEMA_TYPES = new String[]{"javax.persistence.Entity"};
    private static final String[] TABLE_TYPES = new String[]{"javax.persistence.Table", "javax.persistence.SecondaryTable"};
    private static final String COLUMN_TYPE = "javax.persistence.Column";
    private static final String ID_TYPE = "javax.persistence.Id";
    private static final String TRANSIENT_TYPE = "javax.persistence.Transient";

    private static final String JSON_PROPERTY_TYPE = "com.fasterxml.jackson.annotation.JsonProperty";
    private static final String JSON_IGNORE_TYPE = "com.fasterxml.jackson.annotation.JsonIgnore";

    public SpringSchemaCollector() {
        super(SCHEMA_TYPES, new SchemaParser[]{
                new ResponseEntityParser(),
                new PageParser()
        });
    }

    @Override
    protected Schema collectObjectSchema(ReflectClass<?> reflectClass, List<ReflectGenericClass> genericClasses) {
        Schema schema = super.collectObjectSchema(reflectClass, genericClasses);
        SchemaMappingsBuilder mappingsBuilder = new SchemaMappingsBuilder();

        // Check if it is an entity class
        boolean isEntity = reflectClass.getAnnotations().stream().filter(annotation -> {
            for (String entityType : SCHEMA_TYPES) {
                if (entityType.equals(annotation.getName())) {
                    return true;
                }
            }
            return false;
        }).count() > 0;
        if (isEntity) {
            List<String> tables = new ArrayList();
            for (String type : TABLE_TYPES) {
                if (reflectClass.getAnnotation(type) != null && reflectClass.getAnnotation(type).get("name") != null && !reflectClass.getAnnotation(type).get("name").isEmpty()) {
                    tables.add(reflectClass.getAnnotation(type).get("name").replace("\"", "").toUpperCase());
                }
            }
            if (tables.isEmpty()) {
                tables.add(reflectClass.getSimpleName().replaceAll("(.)([A-Z])", "$1_$2").replace("\"", "").toUpperCase());
            }
            mappingsBuilder.relationalTables(tables);
        }
        schema.setMappings(mappingsBuilder.build());
        return schema;
    }

    @Override
    protected void collectProperty(Map<String, Schema> properties, String name, ReflectGenericClass type, List<ReflectAnnotation> annotations, ReflectDescription docs) {
        Schema fieldSchema = this.collect(type);
        getDefaultValue(fieldSchema, docs);
        SchemaMappingsBuilder mappingsBuilder = new SchemaMappingsBuilder();

        // RELATIONAL
        // Column name
        annotations.stream().filter(annotation -> annotation.getName().equals(COLUMN_TYPE)).forEach(annotation -> {
            if (annotation.getString("name") != null && !annotation.getString("name").isEmpty() && !name.equals(annotation.getString("name"))) {
                mappingsBuilder.relationalName(annotation.getString("name").replace("\"", ""));
            }
        });
        // Ignore
        annotations.stream().filter(annotation -> annotation.getName().equals(TRANSIENT_TYPE)).forEach(annotation -> {
            mappingsBuilder.relationalIgnore(true);
        });
        // Id
        annotations.stream().filter(annotation -> annotation.getName().equals(ID_TYPE)).forEach(annotation -> {
            mappingsBuilder.relationalPrimary(true);
        });

        // JSON
        // Property
        annotations.stream().filter(annotation -> annotation.getName().equals(JSON_PROPERTY_TYPE)).forEach(annotation -> {
            if (annotation.getString("value") != null && !annotation.getString("value").isEmpty() && !name.equals(annotation.getString("value"))) {
                mappingsBuilder.jsonName(annotation.getString("value").replace("\"", ""));
            }
        });
        // Ignore
        annotations.stream().filter(annotation -> annotation.getName().equals(JSON_IGNORE_TYPE)).forEach(annotation -> {
            mappingsBuilder.jsonIgnore(true);
        });

        fieldSchema.setMappings(mappingsBuilder.build());

        properties.put(name, fieldSchema);
    }

}
