package com.maxxton.microdocs.crawler.doclet;

import com.sun.javadoc.AnnotationDesc;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author hermans.s
 */
public class Annotations {

    private static List unresolvedAnnotations = new ArrayList();

    public static String getTypeName(AnnotationDesc annotation) {
        try {
            return annotation.annotationType().toString();
        } catch (java.lang.ClassCastException e) {
            if (!unresolvedAnnotations.contains(annotation.toString())) {
                reportError(annotation);
                unresolvedAnnotations.add(annotation.toString());
            }
            return null;
        }
    }

    public static void reportError(AnnotationDesc annotation) {
        ErrorReporter.printWarning("Unable to resolve annotation type '$annotation'; "
                + "to fix this problem, add the class that implements the annotation type to the javadoc classpath");
    }

}
