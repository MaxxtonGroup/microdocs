package com.example.service.order.client;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Test path matching with customer-service
 * @author Steven Hermans
 */
@FeignClient(name = "customer-service")
public interface TestClient2 {

  /**
   * Expected: ERROR
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/does-not-exists")
  public void testEnpointDoesntExists();

  /**
   * Expected: ERROR
   */
  @RequestMapping(method = RequestMethod.DELETE, path = "/api/v1/test2/endpoint1")
  public void testMethodNotAllowed();

  /**
   * Expected: WARNING
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/endpoint2/{someVar}")
  public void testParticalPathVarMatch(@PathVariable String someVar);

  /**
   * Expected: WARNING
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/endpoint3/someStatic")
  public void testParticalPathStaticMatch();

  /**
   * Expected: ERROR
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/endpoint4/{someVar}")
  public void testMisMatchPathVar(@PathVariable String someVar);

  /**
   * Expected: NOTHING
   */
  @RequestMapping(method = RequestMethod.GET, path = "/api/v1/test2/endpoint5/someStatic")
  public void testFullMatch();
}
