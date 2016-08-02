package com.maxxton.microdocs.core.writer;

import com.maxxton.microdocs.core.domain.Project;

import java.io.File;

/**
 * @author Steven Hermans
 */
public interface Writer {

    /**
     * Write project
     * @param project
     * @param outputFile
     * @throws Exception
     */
    public void write(Project project, File outputFile) throws Exception;
}
