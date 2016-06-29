package com.maxxton.microdocs.crawler.core.reflect;

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
}
