
package org.springdoclet.domain;

/**
 *
 * @author hermans.s
 */
public class SchemaArray extends Schema {
	
    private final Schema items;

    public SchemaArray(Schema items, ClassType classType) {
        super(Schema.ARRAY, classType);
        this.items = items;
    }
    
    public SchemaArray(Schema items, ClassType classType, boolean required){
        super(Schema.ARRAY, classType, required);
        this.items = items;
    }
    
    public Schema getItems(){
        return items;
    }
    
}

