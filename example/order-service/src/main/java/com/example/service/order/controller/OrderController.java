package com.example.service.order.controller;

import com.example.service.order.domain.Order;
import com.example.service.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by steve on 25-5-2016.
 */
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @RequestMapping(path="", method = RequestMethod.GET)
    public Page<Order> getOrder(Pageable pageable){
        return orderService.getOrders(pageable);
    }

}
