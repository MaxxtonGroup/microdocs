package com.example.service.order.domain;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

/**
 * Created by steve on 25-5-2016.
 */
@Entity
public class OrderInfo {

    /** @dummy 54 */
    @Id
    private Long orderId;

    /** @dummy 25-5-2016 */
    private Date orderDate;

    /** @dummy 56 */
    private Long customerId;

    /** @dummy 94 */
    private Long billId;

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

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getBillId() {
        return billId;
    }

    public void setBillId(Long billId) {
        this.billId = billId;
    }
}
