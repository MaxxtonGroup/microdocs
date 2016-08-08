package com.maxxton.microdocs.core.domain.check;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Steven Hermans
 */
public class CheckProblemClient {

  private String title;
  private String version;
  private String path;
  private String className;
  @JsonProperty("package")
  private String packageName;
  private int lineNumber;
  private String sourceLink;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public String getClassName() {
    return className;
  }

  public void setClassName(String className) {
    this.className = className;
  }

  public String getPackageName() {
    return packageName;
  }

  public void setPackageName(String packageName) {
    this.packageName = packageName;
  }

  public int getLineNumber() {
    return lineNumber;
  }

  public void setLineNumber(int lineNumber) {
    this.lineNumber = lineNumber;
  }

  public String getSourceLink() {
    return sourceLink;
  }

  public void setSourceLink(String sourceLink) {
    this.sourceLink = sourceLink;
  }
}
