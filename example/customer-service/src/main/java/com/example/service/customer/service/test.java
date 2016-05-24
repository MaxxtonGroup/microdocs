package com.example.service.customer.service;

/**
 * Created by steve on 23-5-2016.
 */
public class test {

    public static void main(String[] args){
        String author = "Steven Hermans (s.hermans@maxxton.com)";
        System.out.println(author.replaceAll("\\(.*\\)", ""));
    }

}
