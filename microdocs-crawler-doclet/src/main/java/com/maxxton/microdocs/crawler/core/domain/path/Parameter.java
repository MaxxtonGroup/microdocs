package com.maxxton.microdocs.crawler.core.domain.path;

/**
 * @author Steven Hermans
 */
public interface Parameter {

    public String getName();
    public void setName(String name);
    public ParameterPlacing getIn();
    public void setIn(ParameterPlacing in);
    public String getDescription();
    public void setDescription(String description);
    public boolean isRequired();
    public void setRequired(boolean required);

}
