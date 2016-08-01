package com.maxxton.microdocs.crawler.doclet;

import com.sun.javadoc.DocErrorReporter;
import com.maxxton.microdocs.crawler.ErrorReporter;

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

    public void printNotice(String msg) {
        super.printNotice(msg);
        delegate.printNotice(msg);
    }

    public void printWarning(String msg) {
        super.printWarning(msg);
        delegate.printWarning(msg);
    }

}
