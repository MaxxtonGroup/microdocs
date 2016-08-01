package com.maxxton.microdocs.crawler.doclet;

import com.maxxton.microdocs.core.reflect.*;
import com.sun.javadoc.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Convert Doclet classes to Reflect classes
 *
 * @author Steven Hermans
 */
public class DocletConverter {

    /**
     * Converts com.sun.javadoc.ClassDoc to ReflectClasses
     *
     * @param classDocs list of ClassDocs
     * @return List of ReflectClasses
     */
    public static List<ReflectClass<?>> convert(ClassDoc... classDocs){
        List<ClassDoc> classes = new ArrayList();
        for(ClassDoc classDoc : classDocs){
            classes.add(classDoc);
        }
        return convert(classes);
    }

    /**
     * Converts com.sun.javadoc.ClassDoc to ReflectClasses
     *
     * @param classDocs list of ClassDocs
     * @return List of ReflectClasses
     */
    public static List<ReflectClass<?>> convert(List<ClassDoc> classDocs) {
        List<ReflectClass<ClassDoc>> reflectClasses = new ArrayList();
        classDocs.forEach(classDoc -> reflectClasses.add(convertClass(classDoc)));
        reflectClasses.forEach(reflectClass -> updateClass(reflectClass, reflectClasses));
        return reflectClasses.stream().collect(Collectors.toList());
    }

    private static void updateClass(ReflectClass<ClassDoc> reflectClass, List<ReflectClass<ClassDoc>> reflectClasses) {
        ClassDoc classDoc = reflectClass.getOriginal();
        // find super class
        if (classDoc.superclassType() != null) {
            reflectClass.setSuperClass(convertGenericClass(classDoc.superclassType(), reflectClasses));
        }
        // find interfaces
        for (Type interfaceType : classDoc.interfaceTypes()) {
            reflectClass.getInterfaces().add(convertGenericClass(interfaceType, reflectClasses));
        }
        //find annotations
        for (AnnotationDesc annotationDesc : classDoc.annotations()) {
            reflectClass.getAnnotations().add(convertAnnotation(annotationDesc));
        }
        //find fields
        for (FieldDoc fieldDoc : classDoc.fields(false)) {
            ReflectField field = convertField(fieldDoc, reflectClasses);
            if (field.isStatic()) {
                reflectClass.getClassFields().add(field);
            } else {
                reflectClass.getDeclaredFields().add(field);
            }
        }
        //find enum
        for (FieldDoc fieldDoc : classDoc.enumConstants()) {
            ReflectField constant = convertField(fieldDoc, reflectClasses);
            reflectClass.getEnumFields().add(constant);
        }
        //find methods
        for (MethodDoc methodDoc : classDoc.methods(false)) {
            ReflectMethod method = convertMethod(methodDoc, reflectClasses);
            if (method.isStatic()) {
                reflectClass.getClassMethods().add(method);
            } else {
                reflectClass.getDeclaredMethods().add(method);
            }
        }
    }

    private static ReflectMethod convertMethod(MethodDoc methodDoc, List<ReflectClass<ClassDoc>> reflectClasses) {
        ReflectMethod method = new ReflectMethod();
        method.setSimpleName(methodDoc.name());
        method.setName(methodDoc.qualifiedName());
        method.setPublic(methodDoc.isPublic());
        method.setStatic(methodDoc.isStatic());
        method.setDescription(convertDoc(methodDoc));
        method.setReturnType(convertGenericClass(methodDoc.returnType(), reflectClasses));
        method.setLineNumber(methodDoc.position().line());
        //find parameters
        for(Parameter parameter : methodDoc.parameters()){
            method.getParameters().add(convertParameter(parameter, reflectClasses));
        }
        //find annotations
        for (AnnotationDesc annotationDesc : methodDoc.annotations()) {
            method.getAnnotations().add(convertAnnotation(annotationDesc));
        }
        return method;
    }

    private static ReflectParameter convertParameter(Parameter parameter, List<ReflectClass<ClassDoc>> reflectClasses) {
        ReflectParameter reflectParameter = new ReflectParameter();
        reflectParameter.setName(parameter.name());
        reflectParameter.setType(convertGenericClass(parameter.type(), reflectClasses));
        //find annotations
        for (AnnotationDesc annotationDesc : parameter.annotations()) {
            reflectParameter.getAnnotations().add(convertAnnotation(annotationDesc));
        }
        return reflectParameter;
    }

    private static ReflectField convertField(FieldDoc fieldDoc, List<ReflectClass<ClassDoc>> reflectClasses) {
        ReflectField field = new ReflectField();
        field.setSimpleName(fieldDoc.name());
        field.setName(fieldDoc.qualifiedName());
        field.setStatic(fieldDoc.isStatic());
        field.setPublic(fieldDoc.isPublic());
        field.setDescription(convertDoc(fieldDoc));
        field.setDefaultValue(fieldDoc.constantValue() != null ? fieldDoc.constantValue().toString() : null);
        field.setType(convertGenericClass(fieldDoc.type(), reflectClasses));
        //find annotations
        for (AnnotationDesc annotationDesc : fieldDoc.annotations()) {
            field.getAnnotations().add(convertAnnotation(annotationDesc));
        }
        return field;
    }

    private static ReflectAnnotation convertAnnotation(AnnotationDesc annotationDesc) {
        ReflectAnnotation annotation = new ReflectAnnotation();
        annotation.setSimpleName(annotationDesc.annotationType().simpleTypeName());
        annotation.setName(annotationDesc.annotationType().qualifiedName());
        annotation.setPackageName(annotationDesc.annotationType().containingPackage() != null ? annotationDesc.annotationType().containingPackage().name() : null);
        for (AnnotationDesc.ElementValuePair pair : annotationDesc.elementValues()) {
            annotation.getProperties().put(pair.element().name(), pair.value().toString());
        }
        return annotation;
    }

    private static ReflectGenericClass convertGenericClass(Type type, List<ReflectClass<ClassDoc>> classes) {
        ReflectGenericClass genericClass = new ReflectGenericClass();
        Optional<ReflectClass<ClassDoc>> optional = classes.stream().filter(clazz -> clazz.getName().equals(type.qualifiedTypeName())).findFirst();
        ReflectClass<ClassDoc> reflectClass;
        if (optional.isPresent()) {
            reflectClass = optional.get();
        }else{
            if (type.asClassDoc() != null) {
                reflectClass = convertClass(type.asClassDoc());
            } else {
                reflectClass = new ReflectClass();
                reflectClass.setName(type.qualifiedTypeName());
                reflectClass.setSimpleName(type.simpleTypeName());
            }
        }
        genericClass.setClassType(reflectClass);

        if (type.asParameterizedType() != null) {
            ParameterizedType paramType = type.asParameterizedType();
            Type[] types = paramType.typeArguments();
            if (types != null) {
                for (Type t : types) {
                    ReflectGenericClass genericType = convertGenericClass(t, classes);
                    genericClass.getGenericTypes().add(genericType);
                }
            }
        }
        return genericClass;
    }

    private static ReflectClass<ClassDoc> convertClass(ClassDoc classDoc) {
        ReflectClass<ClassDoc> reflectClass = new ReflectClass();
        reflectClass.setOriginal(classDoc);
        reflectClass.setName(classDoc.qualifiedName());
        reflectClass.setSimpleName(classDoc.simpleTypeName());
        reflectClass.setPackageName(classDoc.containingPackage() != null ? classDoc.containingPackage().name() : null);
        if(reflectClass.getPackageName() != null){
            reflectClass.setFile(reflectClass.getPackageName().replaceAll("\\.", "/") + "/" + classDoc.position().file().getName());
        }else {
            reflectClass.setFile(classDoc.position().file().getName());
        }
        reflectClass.setAbstract(classDoc.isAbstract());
        if (classDoc.isEnum()) {
            reflectClass.setType(ClassType.ENUM);
        } else if (classDoc.isInterface()) {
            reflectClass.setType(ClassType.INTERFACE);
        } else if (classDoc.isClass()) {
            reflectClass.setType(ClassType.CLASS);
        } else {
            reflectClass.setType(ClassType.OTHER);
        }
        reflectClass.setDescription(convertDoc(classDoc));
        return reflectClass;
    }


    private static ReflectDescription convertDoc(Doc doc) {
        ReflectDescription reflectDescription = new ReflectDescription();
        reflectDescription.setText(doc.commentText());
        for (Tag tag : doc.tags()) {
            reflectDescription.getTags().add(new ReflectDescriptionTag(tag.kind(), tag.text()));
        }
        return reflectDescription;
    }
}
