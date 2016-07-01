package com.maxxton.microdocs.crawler.doclet_old.domain_old;

/**
 * Created by steve on 23-5-2016.
 */
public class Source {

    private final String name;
    private final String simpleName;
    private final int lineNumber;

    public Source(String name, String simpleName, int lineNumber) {
        this.name = name;
        this.simpleName = simpleName;
        this.lineNumber = lineNumber;
    }

    public String getName() {
        return name;
    }

    public String getSimpleName() {
        return simpleName;
    }

    public int getLineNumber() {
        return lineNumber;
    }
}
