package com.maxxton.microdocs.core.reflect;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Steven Hermans
 */
public class ReflectMethod extends ReflectDoc {

    private List<ReflectAnnotation> annotations = new ArrayList();
    private ReflectGenericClass returnType;
    private List<ReflectParameter> parameters = new ArrayList();
    private boolean isStatic;
    private boolean isPublic;
    private int lineNumber;

    public List<ReflectAnnotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<ReflectAnnotation> annotations) {
        this.annotations = annotations;
    }

    public ReflectGenericClass getReturnType() {
        return returnType;
    }

    public void setReturnType(ReflectGenericClass returnType) {
        this.returnType = returnType;
    }

    public List<ReflectParameter> getParameters() {
        return parameters;
    }

    public void setParameters(List<ReflectParameter> parameters) {
        this.parameters = parameters;
    }

    public boolean isStatic() {
        return isStatic;
    }

    public void setStatic(boolean aStatic) {
        isStatic = aStatic;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public int getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
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
