package com.maxxton.microdocs.core.reflect;

/**
 * @author Steven Hermans
 */
public class ReflectDoc {

    private String name;
    private String simpleName;
    private ReflectDescription description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSimpleName() {
        return simpleName;
    }

    public void setSimpleName(String simpleName) {
        this.simpleName = simpleName;
    }

    public ReflectDescription getDescription() {
        return description;
    }

    public void setDescription(ReflectDescription description) {
        this.description = description;
    }
}
