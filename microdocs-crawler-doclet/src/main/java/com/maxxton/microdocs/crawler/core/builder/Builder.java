package com.maxxton.microdocs.crawler.core.builder;

/**
 * Build domain objects
 * @author Steven Hermans
 */
public interface Builder<T> {

    /**
     * Build the domain object
     * @return
     */
    public T build();

}
