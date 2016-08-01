package com.maxxton.microdocs.core.reflect;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Steven Hermans
 */
public class ReflectDescription {

    private String text;
    private List<ReflectDescriptionTag> tags = new ArrayList();

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<ReflectDescriptionTag> getTags() {
        return tags;
    }

    public List<ReflectDescriptionTag> getTags(String name){
        return tags.stream().filter(tag -> tag.getTagName().equalsIgnoreCase(name)).collect(Collectors.toList());
    }

    public void setTags(List<ReflectDescriptionTag> tags) {
        this.tags = tags;
    }
}
