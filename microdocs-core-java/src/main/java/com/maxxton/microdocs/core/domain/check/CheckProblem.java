package com.maxxton.microdocs.core.domain.check;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Steven Hermans
 */
public class CheckProblem {

    private String level;
    private String message;
    private String file;
    private String className;
    @JsonProperty("package")
    private String packageName;
    private int lineNumber;

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public int getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }
}
