package com.maxxton.microdocs.crawler.core.reflect;

/**
 * @author Steven Hermans
 */
public class ReflectDescriptionTag {

    private String tagName;
    private String keyword;
    private String description;

    public ReflectDescriptionTag(String tagName, String keyword, String description) {
        setTagName(tagName);
        setKeyword(keyword);
        setDescription(description);
    }

    public ReflectDescriptionTag(String text){
        setText(text);
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        if(tagName != null) {
            tagName = tagName.toLowerCase();
            if (tagName.startsWith("@")) {
                tagName = tagName.substring(1);
            }
        }
        this.tagName = tagName;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void getText(){
        String text = "@" + tagName;
        if(keyword != null){
            text += keyword;
        }
        if(description != null){
            text += description;
        }
    }

    public void setText(String text){
        String[] split = text.split(" ");
        setTagName(split[0]);
        if(split.length > 1){
            setKeyword(split[1]);
        }else{
            setKeyword(null);
        }
        if(split.length > 2){
            String desc = split[2];
            for(int i = 3; i < split.length; i++){
                desc += split[i];
            }
            setDescription(desc);
        }else{
            setDescription(null);
        }
    }
}
