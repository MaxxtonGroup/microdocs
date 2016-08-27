package com.example.service.customer.repository;

import com.example.service.customer.domain.Customer;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for persisting Customers
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@Repository
public interface CustomerRepository extends PagingAndSortingRepository<Customer, Long> {

    Customer findByEmail(String email);

}
