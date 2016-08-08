package com.maxxton.microdocs.jenkins.notifier.stash.domain;

/**
 * @author Steven Hermans
 */
public class StashTask {

  private String text;
  private StashTaskState state;
  private StashAnchor anchor;

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public StashTaskState getState() {
    return state;
  }

  public void setState(StashTaskState state) {
    this.state = state;
  }

  public StashAnchor getAnchor() {
    return anchor;
  }

  public void setAnchor(StashAnchor anchor) {
    this.anchor = anchor;
  }
}
