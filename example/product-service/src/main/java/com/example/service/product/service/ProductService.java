package com.example.service.product.service;

import com.example.service.product.domain.Product;
import com.example.service.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
     * @param pageable select which page you want to get
     * @return page of products
     */
    public Page<Product> getProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
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

    /**
     * Create new product
     * @param product new product to be created
     * @return The persistence product or null if a product with the same name already exists
     */
    public Product createProduct(Product product) {
        if(getProduct(product.getName()) != null){
            return productRepository.save(product);
        }
        return null;
    }

    /**
     * Remove product from the repository
     * @param productId the id of the product
     * @return true if the product is removed, false if no product with the given id exists
     */
    public boolean removeProduct(Long productId) {
        Product product = getProduct(productId);
        if(product != null){
            productRepository.delete(product);
            return true;
        }
        return false;
    }
}
