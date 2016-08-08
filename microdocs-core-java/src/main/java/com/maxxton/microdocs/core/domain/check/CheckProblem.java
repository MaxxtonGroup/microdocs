package com.maxxton.microdocs.core.domain.check;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Steven Hermans
 */
public class CheckProblem {

  private String level;
  private String message;
  private String path;
  private String className;
  @JsonProperty("package")
  private String packageName;
  private int lineNumber;
  private CheckProblemClient client;

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

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public String getPackageName() {
    return packageName;
  }

  public void setPackageName(String packageName) {
    this.packageName = packageName;
  }

  public CheckProblemClient getClient() {
    return client;
  }

  public void setClient(CheckProblemClient client) {
    this.client = client;
  }
}
