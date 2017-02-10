package com.example.service.product.domain;

import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 *
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
public class Product implements Serializable{

    /** @example 15 */
    private Long productId;

    /** @example dam */
    @NotNull
    @NotEmpty
    private String name;

    /** @dummy 6 */
    @NotNull
    @NotEmpty
    private Double price;

    public Product(){}

    public Product(Long productId, String name, Double price) {
        this.productId = productId;
        this.name = name;
        this.price = price;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
