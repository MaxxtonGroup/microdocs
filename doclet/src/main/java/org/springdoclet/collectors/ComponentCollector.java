package org.springdoclet.collectors;

import com.googlecode.jatl.MarkupBuilder;
import com.sun.javadoc.AnnotationDesc;
import com.sun.javadoc.ClassDoc;
import com.sun.javadoc.Tag;
import org.springdoclet.Annotations;
import org.springdoclet.Collector;
import org.springdoclet.CollectorUtils;
import org.springdoclet.PathBuilder;

import java.util.*;

/**
 *
 * @author hermans.s
 */
public class ComponentCollector implements Collector {

    private static String COMPONENT_TYPE = "org.springframework.stereotype.";
    private Map<String, List<Component>> componentsByType  = new HashMap();
    private Set<String> authors = new HashSet();

    public void processClass(ClassDoc classDoc, AnnotationDesc[] annotations) {
        for(Tag tag : classDoc.tags("author")){
            String author = tag.text().replaceAll("\\(.*\\)", "");
            if(!author.trim().equals("")) {
                authors.add(author.trim().toLowerCase());
            }
        }
        for (AnnotationDesc annotation :  annotations) {
            String annotationType = Annotations.getTypeName(annotation);
            if(annotationType != null && annotationType.startsWith(COMPONENT_TYPE)){
                String type = annotationType.substring(COMPONENT_TYPE.length()).toLowerCase();
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

    public Map<String, List<Component>> getComponents() {
        return componentsByType;
    }

    public Set<String> getAuthors() {
        return authors;
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
