package com.example.service.product.service;

import com.example.service.product.domain.Product;
import com.example.service.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for managing CRUD actions on Customers
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    /**
     * Get a page of products
     * @return page of products
     */
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    /**
     * Get specific product by name
     * @param name name of the product
     * @return Product by the given name or null if no product has this name
     */
    public Product getProduct(String name){
        return productRepository.findByName(name);
    }

    /**
     * Get product by id
     * @param productId product id
     * @return Product or null
     */
    public Product getProduct(Long productId){
        return productRepository.findOne(productId);
    }

}
