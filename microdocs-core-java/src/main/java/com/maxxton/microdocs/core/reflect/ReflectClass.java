package com.maxxton.microdocs.core.reflect;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Steven Hermans
 */
public class ReflectClass<T> extends ReflectDoc {

    private String packageName;
    private ClassType type;
    private String file;
    private boolean isAbstract;

    private ReflectGenericClass superClass;
    private List<ReflectGenericClass> interfaces = new ArrayList();
    private List<ReflectAnnotation> annotations = new ArrayList();

    private List<ReflectField> declaredFields = new ArrayList();
    private List<ReflectField> classFields = new ArrayList();
    private List<ReflectField> enumFields = new ArrayList();
    private List<ReflectMethod> declaredMethods = new ArrayList();
    private List<ReflectMethod> classMethods = new ArrayList();

    @JsonIgnore
    private T original;

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public ClassType getType() {
        return type;
    }

    public void setType(ClassType type) {
        this.type = type;
    }

    public boolean isAbstract() {
        return isAbstract;
    }

    public void setAbstract(boolean anAbstract) {
        isAbstract = anAbstract;
    }

    public ReflectGenericClass getSuperClass() {
        return superClass;
    }

    public void setSuperClass(ReflectGenericClass superClass) {
        this.superClass = superClass;
    }

    public List<ReflectGenericClass> getInterfaces() {
        return interfaces;
    }

    public void setInterfaces(List<ReflectGenericClass> interfaces) {
        this.interfaces = interfaces;
    }

    public List<ReflectAnnotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<ReflectAnnotation> annotations) {
        this.annotations = annotations;
    }

    public List<ReflectField> getDeclaredFields() {
        return declaredFields;
    }

    public void setDeclaredFields(List<ReflectField> declaredFields) {
        this.declaredFields = declaredFields;
    }

    public List<ReflectField> getClassFields() {
        return classFields;
    }

    public void setClassFields(List<ReflectField> classFields) {
        this.classFields = classFields;
    }

    public List<ReflectField> getEnumFields() {
        return enumFields;
    }

    public void setEnumFields(List<ReflectField> enumFields) {
        this.enumFields = enumFields;
    }

    public List<ReflectMethod> getDeclaredMethods() {
        return declaredMethods;
    }

    public void setDeclaredMethods(List<ReflectMethod> declaredMethods) {
        this.declaredMethods = declaredMethods;
    }

    public List<ReflectMethod> getClassMethods() {
        return classMethods;
    }

    public void setClassMethods(List<ReflectMethod> classMethods) {
        this.classMethods = classMethods;
    }

    public T getOriginal() {
        return original;
    }

    public void setOriginal(T original) {
        this.original = original;
    }

    public boolean hasAnnotation(String... names) {
        for (String name : names) {
            if (annotations.stream().filter(annotation -> annotation.getName().equals(name) || annotation.getSimpleName().equals(name)).count() > 0) {
                return true;
            }
        }
        return false;
    }

    public boolean hasParent(String... classNames) {
        for(String className : classNames){
            if(this.getName().equals(className) || className.equals(this.getSimpleName())){
                return true;
            }
        }

        if(superClass == null && this.interfaces.isEmpty()){
            // try to load the real class
            try {
                Class clazz = Class.forName(this.getName());
                Class superClazz = clazz.getSuperclass();
                if(superClazz != null){
                    this.superClass = loadJavaClass(superClazz);
                }
                Class[] interfaceClazzes = clazz.getInterfaces();
                if(interfaceClazzes != null){
                    for(Class interfaceClazz : interfaceClazzes){
                        this.interfaces.add(loadJavaClass(interfaceClazz));
                    }
                }
            } catch (Exception e) {}
        }

        if(superClass != null && superClass.getClassType() != null && superClass.getClassType().hasParent(classNames)){
            return true;
        }

        for(ReflectGenericClass genericInterface : this.interfaces){
            if(genericInterface.getClassType() != null && genericInterface.getClassType().hasParent(classNames)){
                return true;
            }
        }

        return false;
    }

    private ReflectGenericClass loadJavaClass(Class clazz){
        ReflectClass reflectClass = new ReflectClass();
        reflectClass.setSimpleName(clazz.getSimpleName());
        reflectClass.setName(clazz.getName());
        ReflectGenericClass reflectGenericClass = new ReflectGenericClass();
        reflectGenericClass.setClassType(reflectClass);
        return reflectGenericClass;
    }

    public ReflectAnnotation getAnnotation(String name) {
        for(ReflectAnnotation annotation : annotations){
            if(annotation.getName().equals(name) || annotation.getSimpleName().equals(name)){
                return annotation;
            }
        }
        return null;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }
}
