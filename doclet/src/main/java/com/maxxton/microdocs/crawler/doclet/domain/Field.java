
package org.springdoclet.domain;

/**
 *
 * @author hermans.s
 */
public class Field extends Variable{

    private final String defaultValue;
    
    public Field(String name, String type, String description, String defaultValue){
        super(name, type, description);
        this.defaultValue = defaultValue;
    }

    public Field(String name, String type, String description, String defaultValue, boolean required){
        super(name, type, description);
        this.defaultValue = defaultValue;
        setRequired(required);
    }
    
    public String getDefaultValue(){
        return defaultValue;
    }
}
