package com.example.service.customer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Service for which owns the customers and their addresses
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@SpringBootApplication
public class CustomerServiceApplication {

    public static void main(String[] args){
        SpringApplication.run(CustomerServiceApplication.class, args);
    }

}
