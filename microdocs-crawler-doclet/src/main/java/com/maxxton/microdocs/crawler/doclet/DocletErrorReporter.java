package com.maxxton.microdocs.crawler.doclet;

import com.maxxton.microdocs.crawler.ErrorReporter;
import com.sun.javadoc.DocErrorReporter;

/**
 *
 * @author Steven Hermans
 */
public class DocletErrorReporter extends ErrorReporter {

    private final DocErrorReporter delegate;

    public DocletErrorReporter(DocErrorReporter errorReporter) {
        this.delegate = errorReporter;
    }

    public void printError(String msg) {
        super.printError(msg);
        delegate.printError(msg);
    }

    public void printError(String msg, Throwable e) {
        super.printError(msg, e);
        delegate.printError(msg);
    }

    public void printNotice(String msg) {
        super.printNotice(msg);
        delegate.printNotice(msg);
    }

    public void printWarning(String msg) {
        super.printWarning(msg);
        delegate.printWarning(msg);
    }

}
