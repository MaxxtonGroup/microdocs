package com.example.service.customer.controller;

import com.example.service.customer.domain.Customer;
import com.example.service.customer.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling all customer endpoints
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    /**
     * Request a page of customers
     * @param pageable select which page to request
     * @response 200
     * @return Page of customers
     */
    @RequestMapping(path = "", method = RequestMethod.GET)
    public Page<Customer> getCustomers(Pageable pageable){
        return customerService.getCustomers(pageable);
    }

    /**
     * Get a specific customer by id
     * @param customerId id of the customer
     * @response 200
     * @response 404 if customer doesn't exists
     * @return the customer or null
     */
    @RequestMapping(path = "/{customerId}", method=RequestMethod.GET)
    public ResponseEntity<Customer> getCustomer(@PathVariable("customerId") Long customerId, @RequestParam(required=true) String name){
        Customer customer = customerService.getCustomer(customerId);
        if(customer != null){
            return new ResponseEntity<Customer>(customer, HttpStatus.OK);
        }
        return new ResponseEntity<Customer>(HttpStatus.NOT_FOUND);
    }

    /**
     * Create new customer
     * @param customer new customer
     * @response 201 customer is created
     * @response 409 customer with the same email already exists
     * @return CREATED customer with a customerId or CONFLICT if customer with the same email already exists
     */
    @RequestMapping(path = "", method = RequestMethod.POST)
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer){
        Customer newCustomer = customerService.createCustomer(customer);
        if(newCustomer != null){
            return new ResponseEntity<Customer>(newCustomer, HttpStatus.CREATED);
        }else{
            return new ResponseEntity<Customer>(HttpStatus.CONFLICT);
        }
    }

    /**
     * Delete customer by id
     * @param customerId id of the customer
     * @response 200 the customer is removed
     * @response 404 the customer did not exists
     * @return OK if the customer is removed, NOT_FOUND if the customer did not exists
     */
    @RequestMapping(path = "/{customerId}", method = RequestMethod.DELETE)
    public ResponseEntity removeCustomer(@PathVariable("customerId") Long customerId){
        boolean succeed = customerService.removeCustomer(customerId);
        if(succeed){
            return new ResponseEntity(HttpStatus.OK);
        }else{
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
    }



}
