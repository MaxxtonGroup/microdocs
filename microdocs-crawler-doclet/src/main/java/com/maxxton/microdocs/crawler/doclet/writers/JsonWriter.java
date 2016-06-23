/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.maxxton.microdocs.crawler.doclet.writers;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maxxton.microdocs.crawler.doclet.Configuration;
import com.maxxton.microdocs.crawler.doclet.collectors.ComponentCollector;
import com.maxxton.microdocs.crawler.doclet.collectors.ModelCollector;
import com.maxxton.microdocs.crawler.doclet.collectors.RequestMappingCollector;

import java.io.*;
import java.util.Map;

/**
 *
 * @author hermans.s
 */
public class JsonWriter {
    
    public void writeJson(RequestMappingCollector collector, ModelCollector modelCollector, ComponentCollector componentCollector, Configuration config) throws JsonProcessingException, UnsupportedEncodingException, FileNotFoundException, IOException{
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        Map<String, Object> mappings = collector.getMapping();
        mappings.put("models", modelCollector.getSchemas());
        mappings.putAll(componentCollector.getComponents());
        mappings.put("authors", componentCollector.getAuthors());
        String json = objectMapper.writeValueAsString(mappings);
        FileOutputStream fileOut = new FileOutputStream(new File(config.getOutputDirectory(), "project.json"));
        fileOut.write(json.getBytes("UTF-8"));
        fileOut.flush();
        fileOut.close();
    }
    
}
