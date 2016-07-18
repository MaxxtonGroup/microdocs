package com.maxxton.microdocs.crawler.core.collector;

import com.maxxton.microdocs.crawler.core.domain.schema.*;
import com.maxxton.microdocs.crawler.core.reflect.*;
import com.maxxton.microdocs.crawler.doclet.ErrorReporter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Collect Schemas
 * @author Steven Hermans
 */
public class SchemaCollector {

    private Map<String, Schema> schemas = new HashMap();

    private final String[] annotations;
    private final SchemaParser[] schemaParsers;

    public SchemaCollector(String[] annotations, SchemaParser[] schemaParsers) {
        this.annotations = annotations;
        this.schemaParsers = schemaParsers;
    }

    public Map<String, Schema> collect(List<ReflectClass<?>> classes) {
        // add models by their annotations
        Map<String, ReflectClass> models = new HashMap();
        classes.stream().filter(clazz -> clazz.hasAnnotation(annotations) && !schemas.containsKey(clazz.getName())).forEach(clazz -> models.put(clazz.getName(), clazz));

        // collect schemas of their models
        models.entrySet().forEach(entry -> schemas.put(entry.getKey(), collectSchema(entry.getValue(), new ArrayList())));
        return schemas;
    }

    public Schema collect(ReflectClass reflectClass) {
        if(!schemas.containsKey(reflectClass.getName())) {
            Schema schema = collectSchema(reflectClass, new ArrayList());
            if (schema.getType() != SchemaType.OBJECT) {
                return schema;
            }
            schemas.put(reflectClass.getName(), schema);
        }
        Schema schema = new SchemaPrimitive();
        schema.setReference("#/definitions/" + reflectClass.getName());
        return schema;
    }

    public Schema collect(ReflectGenericClass reflectGenericClass) {
        if (reflectGenericClass.getGenericTypes().isEmpty()) {
            return collect(reflectGenericClass.getClassType());
        } else {
            // don't define schemas globally when they have generic types
            return collectSchema(reflectGenericClass.getClassType(), reflectGenericClass.getGenericTypes());
        }
    }

    private Schema collectSchema(ReflectClass reflectClass, List<ReflectGenericClass> genericClasses) {
        ErrorReporter.printNotice("Collect Schema: " + reflectClass.getName());
        for (SchemaParser schemaParser : schemaParsers) {
            if (schemaParser.getClassName().equals(reflectClass.getName())) {
                return schemaParser.parse(reflectClass, genericClasses, this);
            }
        }

        if (reflectClass.getType() == ClassType.ENUM) {
            return collectEnumSchema(reflectClass);
        } else {
            if (reflectClass.getName().equals(Integer.class.getCanonicalName()) ||
                    reflectClass.getName().equals(Integer.TYPE.getCanonicalName()) ||
                    reflectClass.getName().equals(Byte.class.getCanonicalName()) ||
                    reflectClass.getName().equals(Byte.TYPE.getCanonicalName()) ||
                    reflectClass.getName().equals(Short.class.getCanonicalName()) ||
                    reflectClass.getName().equals(Short.TYPE.getCanonicalName()) ||
                    reflectClass.getName().equals(Long.class.getCanonicalName()) ||
                    reflectClass.getName().equals(Long.TYPE.getCanonicalName()) ||
                    reflectClass.getName().equals(Character.class.getCanonicalName()) ||
                    reflectClass.getName().equals(Character.TYPE.getCanonicalName())) {
                return collectIntegerSchema(reflectClass);
            } else if (reflectClass.getName().equals(Float.class.getCanonicalName()) ||
                    reflectClass.getName().equals(Float.TYPE.getCanonicalName()) ||
                    reflectClass.getName().equals(Double.class.getCanonicalName()) ||
                    reflectClass.getName().equals(Double.TYPE.getCanonicalName())) {
                return collectNumberSchema(reflectClass);
            } else if (reflectClass.getName().equals(String.class.getCanonicalName())) {
                return collectStringSchema(reflectClass);
            } else if (reflectClass.getName().equals(Boolean.class.getCanonicalName()) ||
                    reflectClass.getName().equals(Boolean.TYPE.getCanonicalName())) {
                return collectBooleanSchema(reflectClass);
            } else if (reflectClass.getName().equals(Date.class.getCanonicalName()) ||
                    reflectClass.getName().equals(LocalDate.class.getCanonicalName()) ||
                    reflectClass.getName().equals(LocalDateTime.class.getCanonicalName())) {
                return collectDateSchema(reflectClass);
            } else if (reflectClass.hasParent(List.class.getCanonicalName(), Iterator.class.getCanonicalName(), Set.class.getCanonicalName())) {
                return collectArraySchema(reflectClass, genericClasses);
            } else {
                return collectObjectSchema(reflectClass, genericClasses);
            }
        }
    }

    private Schema collectEnumSchema(ReflectClass<?> reflectClass) {
        SchemaEnum schema = new SchemaEnum();
        schema.setType(SchemaType.ENUM);
        schema.setName(reflectClass.getName());
        schema.setSimpleName(reflectClass.getSimpleName());
        schema.setDescription(reflectClass.getDescription().getText());
        List enums = new ArrayList();
        reflectClass.getEnumFields().forEach(field -> enums.add(field.getSimpleName()));
        schema.setEnums(enums);
        return schema;
    }

    private Schema collectIntegerSchema(ReflectClass reflectClass) {
        return new SchemaPrimitive(SchemaType.INTEGER);
    }

    private Schema collectNumberSchema(ReflectClass reflectClass) {
        return new SchemaPrimitive(SchemaType.NUMBER);
    }

    private Schema collectStringSchema(ReflectClass reflectClass) {
        return new SchemaPrimitive(SchemaType.STRING);
    }

    private Schema collectBooleanSchema(ReflectClass reflectClass) {
        return new SchemaPrimitive(SchemaType.BOOLEAN);
    }

    private Schema collectDateSchema(ReflectClass reflectClass) {
        return new SchemaPrimitive(SchemaType.DATE);
    }

    private Schema collectArraySchema(ReflectClass reflectClass, List<ReflectGenericClass> genericClasses) {
        SchemaArray schema = new SchemaArray();
        schema.setType(SchemaType.ARRAY);
        if (!genericClasses.isEmpty()) {
            schema.setItems(collect(genericClasses.get(0)));
        }
        return schema;
    }

    protected Schema collectObjectSchema(ReflectClass<?> reflectClass, List<ReflectGenericClass> genericClasses) {
        // Set placeholder to prevent circular references
        Schema dummy = new SchemaDummy();
        dummy.setType(SchemaType.DUMMY);
        schemas.put(reflectClass.getName(), dummy);

        SchemaObject schema = new SchemaObject();
        schema.setType(SchemaType.OBJECT);
        schema.setName(reflectClass.getSimpleName());
        schema.setGeneric(collectGeneric(genericClasses));
        Map<String, Schema> properties = new HashMap();
        for (ReflectField field : reflectClass.getDeclaredFields()) {
            String name = field.getSimpleName();
            List<ReflectAnnotation> reflectAnnotations = field.getAnnotations().stream().collect(Collectors.toList());
            reflectClass.getDeclaredMethods().stream()
                    .filter(method ->
                            name.equalsIgnoreCase("is" + method.getSimpleName()) ||
                                    name.equalsIgnoreCase("has" + method.getSimpleName()) ||
                                    name.equalsIgnoreCase("get" + method.getSimpleName()) ||
                                    name.equalsIgnoreCase("set" + method.getSimpleName()))
                    .forEach(method -> reflectAnnotations.addAll(method.getAnnotations()));

            collectProperty(properties, name, field.getType(), field.getAnnotations(), field.getDescription());
        }
        schema.setProperties(properties);

        return schema;
    }

    private List<SchemaGenericObject> collectGeneric(List<ReflectGenericClass> genericClasses) {
        if(genericClasses.isEmpty()){
            return null;
        }
        List<SchemaGenericObject> generics = new ArrayList();
        for(ReflectGenericClass clazz : genericClasses){
            SchemaGenericObject generic = new SchemaGenericObject();
            generic.setName(clazz.getClassType().getName());
            generic.setSimpleName(clazz.getClassType().getSimpleName());
            generic.setGeneric(collectGeneric(clazz.getGenericTypes()));
            generics.add(generic);
        }
        return generics;
    }

    protected void collectProperty(Map<String, Schema> properties, String name, ReflectGenericClass type, List<ReflectAnnotation> annotations, ReflectDescription docs) {
        Schema fieldSchema = collect(type);
        properties.put(name, fieldSchema);
    }


}
