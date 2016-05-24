package com.example.service.customer.domain;

import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * Created by steve on 23-5-2016.
 */
@Entity
public class Customer implements Serializable {

    /** @dummy 23*/
    @Id
    private Long customerId;

    /** @dummy John */
    @NotNull
    @NotEmpty
    @Size(max=20)
    private String firstName;

    /** @dummy Snow */
    @NotNull
    @NotEmpty
    @Size(max=20)
    private String lastName;

    /** @dummy jonyy17@xxx.com */
    @NotNull
    @Pattern(regexp = "^([0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$")
    private String email;

    @NotNull
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
