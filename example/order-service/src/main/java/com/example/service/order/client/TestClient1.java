package com.example.service.order.client;

import org.springframework.cloud.netflix.feign.FeignClient;

/**
 * Missing customer-service2 test
 * Expected: ERROR
 * @author Steven Hermans
 */
@FeignClient(name = "customer-service2")
public interface TestClient1 {
}
