package com.maxxton.microdocs.core.collector;

import com.maxxton.microdocs.core.builder.Builder;
import com.maxxton.microdocs.core.reflect.ReflectClass;

import java.util.List;

/**
 * Collector interface
 * @author Steven Hermans
 */
public interface Collector<T extends Builder> {

    /**
     * Collect from reflect classes
     * @param classes reflect classes
     * @return extracted objects
     */
    public List<T> collect(List<ReflectClass<?>> classes);

}