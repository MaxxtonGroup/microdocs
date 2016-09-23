package com.example.service.customer.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Steven Hermans
 */
@RestController
public class TestController2 {

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/does-not-exists2")
  public void testEnpointDoesntExists(){}

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/endpoint1")
  public void testMethodNotAllowed(){}

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/endpoint2/someStatic")
  public void testParticalPathVarMatch(@PathVariable String someVar){}

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/endpoint3/{someVar}")
  public void testParticalPathStaticMatch(){}

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/endpoint4/{someVar}")
  public void testMisMatchPathVar(@PathVariable Long someVar){}

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/endpoint5/someStatic")
  public void testFullMatch(){}

}
