package com.maxxton.microdocs.core.reflect;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Steven Hermans
 */
public class ReflectField extends ReflectDoc {

    private List<ReflectAnnotation> annotations = new ArrayList();
    private ReflectGenericClass type;
    private String defaultValue;
    private boolean isStatic;
    private boolean isPublic;

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

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
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
