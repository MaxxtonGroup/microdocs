package com.maxxton.microdocs.crawler.doclet.collectors;

import com.maxxton.microdocs.crawler.doclet.domain_old.SchemaObject;
import com.maxxton.microdocs.crawler.doclet.domain_old.ClassType;
import com.maxxton.microdocs.crawler.doclet.domain_old.SchemaArray;
import com.maxxton.microdocs.crawler.doclet.domain_old.SchemaReference;
import com.maxxton.microdocs.crawler.doclet.domain_old.SchemaEnum;
import com.maxxton.microdocs.crawler.doclet.domain_old.Schema;
import com.googlecode.jatl.MarkupBuilder;
import com.sun.javadoc.*;
import com.maxxton.microdocs.crawler.doclet.Annotations;
import com.maxxton.microdocs.crawler.doclet.Collector;
import com.maxxton.microdocs.crawler.doclet.CollectorUtils;
import com.maxxton.microdocs.crawler.doclet.PathBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Created by hermans.s on 20-5-2016.
 */
public class ModelCollector implements Collector {

    private static final String ENTITY = "javax.persistence.Entity";

    private Map<String, Schema> schemas = new HashMap();

    @Override
    public void processClass(ClassDoc classDoc, AnnotationDesc[] annotations) {
        AnnotationDesc entity = CollectorUtils.getAnnotation(annotations, ENTITY);
        if (entity != null) {
            parseSchema(classDoc);
        }
    }

    @Override
    public void writeOutput(MarkupBuilder builder, PathBuilder paths) {
    }

    public Map<String, Schema> getSchemas() {
        return this.schemas;
    }

    public Schema parseSchema(Type type) {
        if(type == null){
            return null;
        }
        System.out.println("parse schema: " + type.qualifiedTypeName());
        ClassType classType = CollectorUtils.getClassType(type);
        if(schemas.containsKey(type.qualifiedTypeName())){
            System.out.println("return reference");
            return new SchemaReference(classType);
        }

        Schema schema = getScheme(type, classType.getGeneric(), classType, true);
        if(schema instanceof SchemaObject) {
            System.out.println("Store and return reference");
            schemas.put(type.qualifiedTypeName(), schema);
            return new SchemaReference(classType);
        }
        System.out.println("Return full schema");
        return schema;
    }

    private Schema getScheme(Type type, Type generic, ClassType classType, boolean root) {
        System.out.println("getSchema: " + type.qualifiedTypeName());
        ClassDoc clazzDoc = type.asClassDoc();
        if (clazzDoc != null && clazzDoc.enumConstants().length > 0) {//enum
            List<String> enums = new ArrayList();
            for (FieldDoc constants : clazzDoc.enumConstants()) {
                enums.add(constants.name());
            }
            return new SchemaEnum(enums, classType);
        } else if (type.qualifiedTypeName().equals(String.class.getCanonicalName())) {
            return new Schema(Schema.STRING, classType);
        } else if (type.qualifiedTypeName().equals(Integer.class.getCanonicalName()) || type.qualifiedTypeName().equals(Integer.TYPE.getCanonicalName())
                || type.qualifiedTypeName().equals(Byte.class.getCanonicalName()) || type.qualifiedTypeName().equals(Byte.TYPE.getCanonicalName())
                || type.qualifiedTypeName().equals(Short.class.getCanonicalName()) || type.qualifiedTypeName().equals(Short.TYPE.getCanonicalName())
                || type.qualifiedTypeName().equals(Long.class.getCanonicalName()) || type.qualifiedTypeName().equals(Long.TYPE.getCanonicalName())
                || type.qualifiedTypeName().equals(Character.class.getCanonicalName()) || type.qualifiedTypeName().equals(Character.TYPE.getCanonicalName())
                || type.qualifiedTypeName().equals(Float.class.getCanonicalName()) || type.qualifiedTypeName().equals(Float.TYPE.getCanonicalName())
                || type.qualifiedTypeName().equals(Double.class.getCanonicalName()) || type.qualifiedTypeName().equals(Double.TYPE.getCanonicalName())) {
            return new Schema(Schema.NUMBER, classType);
        } else if (type.qualifiedTypeName().equals(Boolean.class.getCanonicalName()) || type.qualifiedTypeName().equals(Boolean.TYPE.getCanonicalName())) {
            return new Schema(Schema.BOOLEAN, classType);
        } else if (type.qualifiedTypeName().equals(Date.class.getCanonicalName()) || type.qualifiedTypeName().equals(LocalDate.class.getCanonicalName()) || type.qualifiedTypeName().equals(LocalDateTime.class.getCanonicalName())) {
            return new Schema(Schema.DATE, classType);
        } else if (CollectorUtils.hasParent(type.asClassDoc(), List.class.getCanonicalName(), Iterator.class.getCanonicalName())) {
            if (generic != null && classType != null && classType.getGenericType() != null) {
                return new SchemaArray(getScheme(generic, classType.getGenericType().getGeneric(), classType.getGenericType(), false), classType);
            } else {
                return new SchemaArray(null, classType);
            }
        } else if (clazzDoc != null) {
            if(!schemas.containsKey(type.qualifiedTypeName())){
                schemas.put(type.qualifiedTypeName(), null); // reserve place
            }
            if(!root) {
                Schema schema = new SchemaReference(CollectorUtils.getClassType(type));
//                this.schemas.put(type.qualifiedTypeName(), schema);
                parseSchema(type);
                return schema;
            }else{
                SchemaObject modelObject = new SchemaObject(classType);
                for (FieldDoc field : clazzDoc.fields(false)) {
                    if (!field.isStatic()) {
                        ClassType paramType = CollectorUtils.getClassType(field.type());

                        if (paramType.getGeneric() == null && classType != null) {
                            paramType = classType.getGenericType();
                        }
                        Schema schema = getScheme(field.type(), (paramType != null ? paramType.getGeneric() : null), (paramType != null ? paramType.getGenericType() : null), false);

                        if(field.tags("dummy").length > 0){
                            String preview = field.tags("dummy")[0].text();
                            try {
                                if (schema.getType().equals(Schema.NUMBER)) {
                                    Integer number = Integer.parseInt(preview);
                                    schema.setDummy(number);
                                }else if (schema.getType().equals(Schema.BOOLEAN)) {
                                    Boolean b = Boolean.parseBoolean(preview);
                                    schema.setDummy(b);
                                }else if (schema.getType().equals(Schema.STRING)) {
                                    schema.setDummy(preview);
                                }
                            }catch(Exception e){
                                throw new RuntimeException("Could not parse @preview " + preview + " at " + clazzDoc.qualifiedName() + "#" + field.name());
                            }
                        }
                        schema.setDescription(field.commentText());

                        modelObject.addProperty(field.name(), schema);
                    }
                }

                AnnotationDesc[] annotations = clazzDoc.annotations();
                if(CollectorUtils.getAnnotation(annotations, "javax.persistence.Entity") != null){
                    List<String> tables = new ArrayList();

                    for (AnnotationDesc annotation : annotations) {
                        String annotationType = Annotations.getTypeName(annotation);
                        if (annotationType != null && annotationType.startsWith("javax.persistence.Table") || annotationType.startsWith("javax.persistence.SecondaryTable")) {
                            if(annotation != null && annotation.elementValues() != null){
                                for(AnnotationDesc.ElementValuePair pair : annotation.elementValues()){
                                    if(pair.element().name().equals("name")){
                                        tables.add(pair.value().toString().replace("\"", ""));
                                    }
                                }
                            }
                        }
                    }
                    if(tables.isEmpty()){
                        tables.add(clazzDoc.name().replaceAll("(.)([A-Z])", "$1_$2"));
                    }
                    modelObject.setTables(tables);
                }

                if(clazzDoc.superclass() != null && !clazzDoc.superclass().qualifiedName().equals(Object.class.getCanonicalName())){
                    modelObject.setSuperReference(clazzDoc.superclass().qualifiedName());
                    parseSchema(clazzDoc.superclass());
                }

                return modelObject;
            }
        }
        return null;
    }
}
