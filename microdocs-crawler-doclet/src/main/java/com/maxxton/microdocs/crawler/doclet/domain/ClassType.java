
package com.maxxton.microdocs.crawler.doclet.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.javadoc.Type;

/**
 *
 * @author hermans.s
 */
public class ClassType {
    
    private String simpleName;
    private String name;
    private ClassType genericType;
    
    @JsonIgnore
    private Type generic;
    
    public ClassType(String simpleName, String name){
        this.simpleName = simpleName;
        this.name = name;
    }
    
    public void setGenericType(ClassType classType){
        this.genericType = classType;
    }
    
    public String getName(){
        return name;
    }
    
    public String getSimpleName(){
        return simpleName;
    }
    
    public ClassType getGenericType(){
        return genericType;
    }

    public Type getGeneric() {
        return generic;
    }

    public void setGeneric(Type generic) {
        this.generic = generic;
    }
    
}
