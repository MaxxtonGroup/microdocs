package com.maxxton.microdocs.jenkins;

import com.maxxton.microdocs.crawler.ErrorReporter;

import java.io.PrintStream;

/**
 * @author Steven Hermans
 */
public class JenkinsErrorReporter extends ErrorReporter {

    private final PrintStream stream;

    public JenkinsErrorReporter(PrintStream stream) {
        this.stream = stream;
    }

    @Override
    public void printError(String msg) {
        stream.println(msg);
    }

    @Override
    public void printError(String msg, Throwable e) {
        stream.println(msg);
        e.printStackTrace(stream);
    }

    @Override
    public void printNotice(String msg) {
        stream.println(msg);
    }

    @Override
    public void printWarning(String msg) {
        stream.println(msg);
    }
}
