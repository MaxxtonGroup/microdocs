
package com.maxxton.microdocs.crawler.doclet_old.domain_old;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author hermans.s
 */
public class Client {
    
    private String name;
    private List<Endpoint> endpoints = new ArrayList();
    
    public Client(String name, List<Endpoint> endpoints){
        this.name = name;
        this.endpoints = endpoints;
    }
    
    public String getName(){
        return name;
    }
    
    public List<Endpoint> getEndpoints(){
        return endpoints;
    }
    
}
