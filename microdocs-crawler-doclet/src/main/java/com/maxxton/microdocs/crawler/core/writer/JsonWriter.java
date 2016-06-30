package com.maxxton.microdocs.crawler.core.writer;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maxxton.microdocs.crawler.core.domain.Project;

import java.io.*;
import java.util.Map;

/**
 * Writer project to json file
 *
 * @author Steven Hermans
 */
public class JsonWriter implements Writer{

    /**
     * Write project to json file
     * @param project
     * @param outputFile
     * @throws Exception
     */
    public void write(Project project, File outputFile) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        String json = objectMapper.writeValueAsString(project);

        FileOutputStream fileOut = new FileOutputStream(outputFile);
        fileOut.write(json.getBytes("UTF-8"));
        fileOut.flush();
        fileOut.close();
    }

}
