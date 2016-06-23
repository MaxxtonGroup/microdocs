package com.maxxton.microdocs.crawler.doclet.domain;

/**
 * Created by hermans.s on 20-5-2016.
 */
public class Variable {

    private final String name;
    private final String type;
    private final String description;
    private boolean required;

    public Variable(String name, String type, String description) {
        if(name != null){
            name = name.replace("\"", "");
        }
        this.name = name;
        this.type = type;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }
}
