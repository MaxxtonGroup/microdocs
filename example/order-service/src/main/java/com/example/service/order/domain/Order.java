package com.example.service.order.domain;

import javax.persistence.Id;
import java.util.Date;

/**
 * Created by steve on 25-5-2016.
 */
public class Order{

    /** @dummy 54 */
    @Id
    private Long orderId;

    /** @dummy 25-5-2016 */
    private Date orderDate;

    private Customer customer;

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}
