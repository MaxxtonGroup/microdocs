package com.maxxton.microdocs.crawler;

/**
 *
 * @author Steven Hermans
 */
public class ErrorReporter {

    private static ErrorReporter reporter = new ErrorReporter();

    public static void set(ErrorReporter reporter){
        ErrorReporter.reporter = reporter;
    }

    public static ErrorReporter get(){
        return reporter;
    }

    public void printError(String msg) {
        System.err.println("Error: " + msg);
    }

    public void printError(String msg, Throwable e) {
        System.err.println("Error: " + msg);
        e.printStackTrace();
    }

    public void printNotice(String msg) {
        System.out.println("Notice: " + msg);
    }

    public void printWarning(String msg) {
        System.out.println("Warning: " + msg);
    }

}
