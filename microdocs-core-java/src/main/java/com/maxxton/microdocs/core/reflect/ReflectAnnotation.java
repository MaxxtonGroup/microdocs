package com.maxxton.microdocs.core.reflect;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Steven Hermans
 */
public class ReflectAnnotation extends ReflectDoc{

    private String packageName;
    private Map<String, String> properties = new HashMap();

    public Map<String, String> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, String> properties) {
        this.properties = properties;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public boolean has(String property){
        return properties.containsKey(property);
    }

    public String get(String property){
        return properties.get(property);
    }

    public String getString(String property){
        if(!has(property)){
            return null;
        }
        String value = get(property).trim();
        if(value.startsWith("\"") && value.endsWith("\"")){
            return value.substring(1, value.length()-1);
        }
        return null;
    }

    public Integer getInt(String property){
        if(getString(property) == null){
            try{
                return Integer.parseInt(get(property));
            }catch(NumberFormatException e){
                return null;
            }
        }
        return null;
    }

    public Double getDouble(String property){
        if(getString(property) == null){
            try{
                return Double.parseDouble(get(property));
            }catch(NumberFormatException e){
                return null;
            }
        }
        return null;
    }

    public boolean getBoolean(String property){
        if(getString(property) == null){
            try{
                return Boolean.parseBoolean(get(property));
            }catch(NumberFormatException e){
                return false;
            }
        }
        return false;
    }

    public String[] getArray(String property){
        if(!has(property)){
            return null;
        }
        String value = get(property).trim();
        if(value.startsWith("{") && value.endsWith("}")){
            value = value.substring(1, value.length()-1);
            return value.split(",");
        }
        return new String[]{value};
    }
}
