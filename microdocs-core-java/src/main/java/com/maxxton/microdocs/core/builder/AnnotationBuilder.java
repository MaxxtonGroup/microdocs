package com.maxxton.microdocs.core.builder;

import com.maxxton.microdocs.core.domain.component.Annotation;

import java.util.HashMap;

/**
 * Build annotation
 * @author Steven Hermans
 */
public class AnnotationBuilder implements Builder<Annotation> {

    private Annotation annotation = new Annotation();
    private String name;

    public AnnotationBuilder name(String name){
        this.name = name;
        return this;
    }

    public String name(){
        return this.name;
    }

    public AnnotationBuilder property(String property, Object value){
        if(annotation.getProperties() == null){
            annotation.setProperties(new HashMap());
        }
        annotation.getProperties().put(property, value);
        return this;
    }

    @Override
    public Annotation build() {
        return annotation;
    }
}
