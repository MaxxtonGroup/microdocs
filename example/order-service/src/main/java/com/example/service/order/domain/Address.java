package com.example.service.order.domain;

import java.io.Serializable;

/**
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
public class Address implements Serializable{

    /** @dummy 15 */
    private Long addressId;

    /** @dummy dam */
    private String address;

    /** @dummy 6 */
    private String houseNumber;

    /** @dummy Middelburg */
    private String city;

    /** @dummy 4512CD */
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
