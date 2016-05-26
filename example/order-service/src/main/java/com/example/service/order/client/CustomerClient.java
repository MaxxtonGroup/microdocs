package com.example.service.order.client;

import com.example.service.order.domain.Customer;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@FeignClient(name = "customer-service")
@RequestMapping("/api/v1/customers")
public interface CustomerClient {

    @RequestMapping(path = "/{customerId}", method = RequestMethod.GET)
    public Customer getCustomer(Long customerId);

}
