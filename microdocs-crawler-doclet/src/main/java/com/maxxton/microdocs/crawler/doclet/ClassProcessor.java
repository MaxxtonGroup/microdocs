
package com.maxxton.microdocs.crawler.doclet;

import com.sun.javadoc.AnnotationDesc;
import com.sun.javadoc.ClassDoc;

/**
 * @author hermans.s
 */
public class ClassProcessor {

    public void process(ClassDoc[] classes, Collector[] collectors) {
        for (Collector collector : collectors) {
            processClasses(classes, collector);
        }
        for(Collector collector : collectors){
            collector.postProcess();
        }
    }

    private void processClasses(ClassDoc[] classes, Collector collector) {
        for (ClassDoc classDoc : classes) {
            AnnotationDesc[] annotations = classDoc.annotations();
            if (annotations.length > 0) {
                collector.processClass(classDoc, annotations);
            }
        }
    }
}
