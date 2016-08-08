package com.maxxton.microdocs.jenkins.notifier.stash.domain;

/**
 *
 * @author Steven Hermans
 */
public class StashComment {

    private String text;
    private StashAnchor anchor;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public StashAnchor getAnchor() {
        return anchor;
    }

    public void setAnchor(StashAnchor anchor) {
        this.anchor = anchor;
    }
}
