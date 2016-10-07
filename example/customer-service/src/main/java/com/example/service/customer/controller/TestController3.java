package com.example.service.customer.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Steven Hermans
 */
@RestController
public class TestController3 {

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint1")
  public void testEndpointMatchRequiredRequestParams(@RequestParam(required = true) boolean a){}

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint2")
  public void testEndpointMatchRequestParams(@RequestParam(required = false) boolean a){}

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint3")
  public void testEndpointMissingRequiredRequestParams(@RequestParam(required = true) boolean a){}

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint4")
  public void testEndpointMissingNotRequiredRequestParams(@RequestParam(required = false) boolean a){}

  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint5")
  public void testEndpointMismatchTypeRequestParams(@RequestParam(required = false) boolean a){}
}
