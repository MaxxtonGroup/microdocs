package com.maxxton.microdocs.jenkins.notifier.stash.domain;

/**
 * @author Steven Hermans
 */
public class StashAnchor {

  private Integer id;
  private Integer line;
  private StashAnchorType type;
  private StashLineType lineType;
  private StashFiletype filetype;
  private String path;
  private String sourcePath;

  public StashLineType getLineType() {
    return lineType;
  }

  public void setLineType(StashLineType lineType) {
    this.lineType = lineType;
  }

  public StashFiletype getFiletype() {
    return filetype;
  }

  public void setFiletype(StashFiletype filetype) {
    this.filetype = filetype;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public String getSourcePath() {
    return sourcePath;
  }

  public void setSourcePath(String sourcePath) {
    this.sourcePath = sourcePath;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Integer getLine() {
    return line;
  }

  public void setLine(Integer line) {
    this.line = line;
  }

  public StashAnchorType getType() {
    return type;
  }

  public void setType(StashAnchorType type) {
    this.type = type;
  }
}
