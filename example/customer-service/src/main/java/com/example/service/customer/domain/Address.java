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
public class Address implements Serializable{

    /** @dummy 15 */
    @Id
    private Long addressId;

    /** @dummy dam */
    @NotNull
    @NotEmpty
    @Size(max = 30)
    private String address;

    /** @dummy 6 */
    @NotNull
    @Pattern(regexp = "/^\\d+[a-zA-Z]*$/")
    private String houseNumber;

    /** @dummy Middelburg */
    @NotNull
    @NotEmpty
    @Size(max = 30)
    private String city;

    /** @dummy 4512CD */
    @NotNull
    @Pattern(regexp = "/^\\d{4} ?[a-z]{2}$/i")
    private String zipCode;

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
}
