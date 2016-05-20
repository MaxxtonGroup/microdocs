package org.springdoclet.collectors;

import java.util.*;
import org.springdoclet.*;
import com.sun.javadoc.*;
import com.googlecode.jatl.MarkupBuilder;

/**
 *
 * @author hermans.s
 */
public class ComponentCollector implements Collector {

    private static String COMPONENT_TYPE = "org.springframework.stereotype.";
    private Map<String, List<Component>> componentsByType  = new HashMap();

    public void processClass(ClassDoc classDoc, AnnotationDesc[] annotations) {
        for (AnnotationDesc annotation :  annotations) {
            String annotationType = Annotations.getTypeName(annotation);
            if(annotationType != null && annotationType.startsWith(COMPONENT_TYPE)){
                String type = annotationType.substring(COMPONENT_TYPE.length());
                addComponent(classDoc, type);
            }
        }
    }

    private void addComponent(ClassDoc classDoc, String type) {
        Component component = new Component(classDoc.qualifiedTypeName(), CollectorUtils.getFirstSentence(classDoc.commentText()));
        if(!componentsByType.containsKey(type)){
            componentsByType.put(type, new ArrayList());
        }
        componentsByType.get(type).add(component);
    }

    public void writeOutput(MarkupBuilder builder, PathBuilder paths) {
//        builder.div(id: 'components'
//        ) {
//      h2 'Components'
//            for (entry in  componentsByType.sort()) {
//                h3 entry
//                .key table
//                (id:
//                entry.key
//                
//                    ) {
///*
//          tr {
//            th 'Class'
//            th 'Description'
//          }
//*/
//          def sortedComponents = entry.value.sort {it.className }
//                    for (component in  sortedComponents) {
//                        tr {
//                            td {
//                                a(href
//                                : paths.buildFilePath(component.className), component.className
//                            )
//              }
//              td {code {
//                                mkp.yieldUnescaped(component.text ?  : ' ') }
//                            }
//                        }
//                    }
//                }
//            }
//        }
    }
    
    private class Component{
        
        private final String className;
        private final String description;

        public Component(String className, String description) {
            this.className = className;
            this.description = description;
        }

        public String getClassName() {
            return className;
        }

        public String getDescription() {
            return description;
        }
        
    }
}
