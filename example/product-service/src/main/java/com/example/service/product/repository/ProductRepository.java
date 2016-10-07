package com.example.service.product.repository;

import com.example.service.product.domain.Product;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for persisting Customers
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@Repository
public interface ProductRepository extends PagingAndSortingRepository<Product, Long> {

    Product findByName(String name);
}
