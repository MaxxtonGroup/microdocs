package com.example.service.order.domain;
import java.io.Serializable;

/**
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
public class Customer implements Serializable {

    /** @dummy 23*/
    private Long customerId;

    /** @dummy John */
    private String firstName;

    /** @dummy Snow */
    private String lastName;

    /** @dummy jonyy17@xxx.com */
    private String email;

    private Address deliverAddress;

    private Address billAddress;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Address getDeliverAddress() {
        return deliverAddress;
    }

    public void setDeliverAddress(Address deliverAddress) {
        this.deliverAddress = deliverAddress;
    }

    public Address getBillAddress() {
        return billAddress;
    }

    public void setBillAddress(Address billAddress) {
        this.billAddress = billAddress;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
