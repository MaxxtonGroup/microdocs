package com.maxxton.microdocs.core.reflect;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Steven Hermans
 */
public class ReflectGenericClass {

    @JsonIgnore
    private ReflectClass classType;
    private List<ReflectGenericClass> genericTypes = new ArrayList();

    public ReflectClass getClassType() {
        return classType;
    }

    public void setClassType(ReflectClass classType) {
        this.classType = classType;
    }

    public List<ReflectGenericClass> getGenericTypes() {
        return genericTypes;
    }

    public void setGenericTypes(List<ReflectGenericClass> genericTypes) {
        this.genericTypes = genericTypes;
    }
}
