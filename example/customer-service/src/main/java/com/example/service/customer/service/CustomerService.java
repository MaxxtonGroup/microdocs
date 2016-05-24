package com.example.service.customer.service;

import com.example.service.customer.domain.Customer;
import com.example.service.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service for managing CRUD actions on Customers
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Get a page of customers
     * @param pageable select which page you want to get
     * @return page of customers
     */
    public Page<Customer> getCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    /**
     * Get specific customer by email
     * @param email email address of the customer
     * @return Customer by the given email or null if no customers has this email
     */
    public Customer getCustomer(String email){
        return customerRepository.findByEmail(email);
    }

    /**
     * Get customer by id
     * @param customerId customer id
     * @return Customer or null
     */
    public Customer getCustomer(Long customerId){
        return customerRepository.findOne(customerId);
    }

    /**
     * Create new customer
     * @param customer new customer to be created
     * @return The persistence customer or null if a customer with the same email already exists
     */
    public Customer createCustomer(Customer customer) {
        if(getCustomer(customer.getEmail()) != null){
            return customerRepository.save(customer);
        }
        return null;
    }

    /**
     * Remove customer from the repository
     * @param customerId the id of the customer
     * @return true if the customer is removed, false if no customer with the given id exists
     */
    public boolean removeCustomer(Long customerId) {
        Customer customer = getCustomer(customerId);
        if(customer != null){
            customerRepository.delete(customer);
            return true;
        }
        return false;
    }
}
