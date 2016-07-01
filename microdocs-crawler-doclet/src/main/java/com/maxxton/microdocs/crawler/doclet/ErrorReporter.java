package com.maxxton.microdocs.crawler.doclet;

import com.sun.javadoc.DocErrorReporter;

/**
 *
 * @author hermans.s
 */
public class ErrorReporter {

    private static DocErrorReporter delegate;

    public static void setErrorReporter(DocErrorReporter errorReporter) {
        delegate = errorReporter;
    }

    public static void printError(String msg) {
        System.err.println("Error: " + msg);
        delegate.printError(msg);
    }

    public static void printNotice(String msg) {
        System.out.println("Notice: " + msg);
        delegate.printNotice(msg);
    }

    public static void printWarning(String msg) {
        System.out.println("Warning: " + msg);
        delegate.printWarning(msg);
    }

}
