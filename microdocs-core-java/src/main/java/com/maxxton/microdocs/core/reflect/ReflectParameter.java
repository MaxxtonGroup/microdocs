package com.maxxton.microdocs.core.reflect;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Steven Hermans
 */
public class ReflectParameter {

    private List<ReflectAnnotation> annotations = new ArrayList();
    private ReflectGenericClass type;
    private String name;

    public List<ReflectAnnotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<ReflectAnnotation> annotations) {
        this.annotations = annotations;
    }

    public ReflectGenericClass getType() {
        return type;
    }

    public void setType(ReflectGenericClass type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean hasAnnotation(String... names) {
        for (String name : names) {
            if (annotations.stream().filter(annotation -> annotation.getName().equals(name) || annotation.getSimpleName().equals(name)).count() > 0) {
                return true;
            }
        }
        return false;
    }

    public ReflectAnnotation getAnnotation(String name) {
        for(ReflectAnnotation annotation : annotations){
            if(annotation.getName().equals(name) || annotation.getSimpleName().equals(name)){
                return annotation;
            }
        }
        return null;
    }
}
