package com.example.service.order.client;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author Steven Hermans
 */
@FeignClient(name = "customer-service")
public class TestClient3 {

  /**
   * Expected: NOTHING
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint1")
  public void testEndpointMatchRequiredRequestParams(@RequestParam boolean a){}

  /**
   * Expected: NOTHING
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint2")
  public void testEndpointMatchRequestParams(@RequestParam boolean a){}

  /**
   * Expected: ERROR
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint3")
  public void testEndpointMissingRequiredRequestParams(){}

  /**
   * Expected: NOTHING
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint4")
  public void testEndpointMissingNotRequiredRequestParams(){}

  /**
   * Expected: WARNING
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test3/endpoint5")
  public void testEndpointMismatchTypeRequestParams(@RequestParam String a){}

}
