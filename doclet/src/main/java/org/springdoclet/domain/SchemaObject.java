
package org.springdoclet.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author hermans.s
 */
public class SchemaObject extends Schema {
	
    private final Map<String, Schema> properties = new HashMap();
    private List<String> tables = null;

    public SchemaObject(ClassType classType) {
        super(Schema.OBJECT, classType);
    }
    
    public SchemaObject(ClassType classType, boolean required){
        super(Schema.OBJECT, classType, required);
    }
    
    public void addProperty(String name, Schema schema){
        properties.put(name, schema);
    }
    
    public Map<String, Schema> getProperties(){
        return properties;
    }

    public List<String> getTables() {
        return tables;
    }

    public void setTables(List<String> tables) {
        this.tables = tables;
    }
}

