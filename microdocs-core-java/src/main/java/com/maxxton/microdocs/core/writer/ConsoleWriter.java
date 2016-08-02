package com.maxxton.microdocs.core.writer;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maxxton.microdocs.core.domain.Project;

import java.io.File;

/**
 * Write project as json to the console
 *
 * @author Steven Hermans
 */
public class ConsoleWriter implements Writer {

    /**
     * Write project to console as json
     *
     * @param project
     * @param outputFile
     * @throws Exception
     */
    @Override
    public void write(Project project, File outputFile) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_DEFAULT);
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);

        String json = objectMapper.writeValueAsString(project);
        System.out.println(json);
    }

}
