package com.example.service.product.repository;

import com.example.service.product.domain.Product;
import com.google.common.collect.Lists;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Repository for persisting Customers
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@Service
public class ProductRepository {

    private static final List<Product> PRODUCT_LIST = Lists.newArrayList(new Product[]{
        new Product(1l, "Water", 13.52),
        new Product(2l, "Fire", 23.00),
        new Product(2l, "Earth", 12.00),
        new Product(2l, "Air", 250.00)
    });

    public List<Product> findAll(){
        return PRODUCT_LIST;
    }

    public Product findByName(String name){
        return PRODUCT_LIST.stream().filter(product -> product.getName().equalsIgnoreCase(name)).findFirst().orElse(null);
    }

    public Product findOne(Long id){
        return PRODUCT_LIST.stream().filter(product -> product.getProductId().longValue() == id.longValue()).findFirst().orElse(null);
    }
}
