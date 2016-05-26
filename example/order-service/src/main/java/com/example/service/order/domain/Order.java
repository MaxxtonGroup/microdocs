package com.example.service.order.domain;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import java.util.Date;

/**
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@Entity
public class Order{

    /** @dummy 54 */
    @Id
    private Long orderId;

    /** @dummy 25-5-2016 */
    private Date orderDate;

    private Customer customer;

    @Enumerated
    private OrderStatus status = OrderStatus.PENDING;

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

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
