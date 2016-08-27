package com.example.service.product.controller;

import com.example.service.product.domain.Product;
import com.example.service.customer.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling all products endpoints
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@RestController
@RequestMapping("/api/v1/customers")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Request a page of products
     * @param pageable select which page to request
     * @response 200
     * @return Page of products
     */
    @RequestMapping(path = "", method = RequestMethod.GET)
    public Page<Product> getProducts(Pageable pageable){
        return productService.getProducts(pageable);
    }

    /**
     * Get a specific product by id
     * @param productId id of the product
     * @response 200
     * @response 404 if product doesn't exists
     * @return the product or null
     */
    @RequestMapping(path = "/{productId}", method=RequestMethod.GET)
    public ResponseEntity<Product> getCustomer(@PathVariable("productId") Long productId){
        Product customer = productService.getProduct(productId);
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
        Customer newCustomer = productService.createCustomer(customer);
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
        boolean succeed = productService.removeCustomer(customerId);
        if(succeed){
            return new ResponseEntity(HttpStatus.OK);
        }else{
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
    }



}
