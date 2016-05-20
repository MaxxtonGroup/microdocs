package org.springdoclet;

import com.sun.javadoc.AnnotationDesc;
import com.sun.javadoc.ClassDoc;
import com.sun.javadoc.ParameterizedType;
import com.sun.javadoc.Type;
import com.sun.xml.internal.xsom.impl.scd.Iterators;
import org.springdoclet.domain.ClassType;

import java.text.BreakIterator;
import java.util.List;

/**
 * Created by hermans.s on 20-5-2016.
 */
public class CollectorUtils {

    public static String getFirstSentence(String text) {
        BreakIterator boundary = BreakIterator.getSentenceInstance();
        boundary.setText(text);
        int start = boundary.first();
        int end = boundary.next();
        if (start > -1 && end > -1) {
            text = text.substring(start, end).trim();
            text = text.replaceAll("\n", "");
        }
        return text;
    }

    public static AnnotationDesc getAnnotation(AnnotationDesc[] annotations, String type) {
        for (AnnotationDesc annotation : annotations) {
            String annotationType = Annotations.getTypeName(annotation);
            if (annotationType != null && annotationType.startsWith(type)) {
                return annotation;
            }
        }
        return null;
    }

    public static boolean hasParent(Type type, String... classNames) {
        if (type == null) {
            return false;
        }
        for (String className : classNames) {
            if (type.qualifiedTypeName().equals(className)) {
                return true;
            }
        }
        if(type.asClassDoc() != null) {
            if (type.asClassDoc().superclass() != null) {
                if (hasParent(type.asClassDoc().superclass(), classNames)) {
                    return true;
                }
            }
            for (ClassDoc interf : type.asClassDoc().interfaces()) {
                if (hasParent(interf, classNames)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean isArray(Type type){
        return hasParent(type, List.class.getCanonicalName(), Iterators.class.getCanonicalName());
    }

    public static ClassType getClassType(Type type) {
        ClassType classType = new ClassType(type.simpleTypeName(), type.qualifiedTypeName());
        if (type.asParameterizedType() != null) {
            ParameterizedType paramType = type.asParameterizedType();
            Type[] types = paramType.typeArguments();
            if (types != null && types.length > 0) {
                classType.setGenericType(getClassType(types[0]));
                classType.setGeneric(types[0]);
            }
        }
        return classType;
    }

}
