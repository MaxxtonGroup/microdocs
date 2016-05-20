package org.springdoclet.domain;

/**
 * Created by hermans.s on 20-5-2016.
 */
public class Variable {

    private final String name;
    private final Schema schema;
    private final String description;

    public Variable(String name, Schema schema, String description) {
        this.name = name;
        this.schema = schema;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public Schema getSchema() {
        return schema;
    }

    public boolean isRequired(){
        return schema.isRequired();
    }

    public void setRequired(boolean required){
        schema.setRequired(true);
    }

    public String getDescription(){
        return schema.getDescription();
    }

    public void setDescription(String description){
        schema.setDescription(description);
    }
}
