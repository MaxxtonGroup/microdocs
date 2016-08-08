package com.maxxton.microdocs.core.domain.component;

/**
 * @author Steven Hermans
 */
public class ComponentLink {

    private Integer lineNumber;
    private boolean async;
    private Method target;

    public Integer getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(Integer lineNumber) {
        this.lineNumber = lineNumber;
    }

    public boolean isAsync() {
        return async;
    }

    public void setAsync(boolean async) {
        this.async = async;
    }

    public Method getTarget() {
        return target;
    }

    public void setTarget(Method target) {
        this.target = target;
    }
}
