package com.maxxton.microdocs.core.writer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.maxxton.microdocs.core.domain.Project;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

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
