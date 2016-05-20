/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.springdoclet.writers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import org.springdoclet.Configuration;
import org.springdoclet.collectors.ModelCollector;
import org.springdoclet.collectors.RequestMappingCollector;

/**
 *
 * @author hermans.s
 */
public class JsonWriter {
    
    public void writeJson(RequestMappingCollector collector, ModelCollector modelCollector, Configuration config) throws JsonProcessingException, UnsupportedEncodingException, FileNotFoundException, IOException{
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> mappings = collector.getMapping();
        mappings.put("models", modelCollector);
        String json = objectMapper.writeValueAsString(mappings);
        FileOutputStream fileOut = new FileOutputStream(new File(config.getOutputDirectory(), "project.json"));
        fileOut.write(json.getBytes("UTF-8"));
        fileOut.flush();
        fileOut.close();
    }
    
}
