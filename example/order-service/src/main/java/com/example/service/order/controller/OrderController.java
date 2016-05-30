package com.example.service.order.controller;

import com.example.service.order.domain.Order;
import com.example.service.order.domain.OrderInfo;
import com.example.service.order.domain.OrderStatus;
import com.example.service.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Get page of orders
     * @param pageable define which page to request
     * @response 200
     * @return List of orders
     */
    @RequestMapping(path = "", method = RequestMethod.GET)
    public Page<Order> getOrder(Pageable pageable) {
        return orderService.getOrders(pageable);
    }

    /**
     * Get order by id
     * @param orderId order id
     * @response 200
     * @response 404
     * @return Order or not found
     */
    @RequestMapping(path = "/{orderId}", method = RequestMethod.GET)
    public ResponseEntity<Order> getOrder(@PathVariable("orderId") Long orderId) {
        Order order = orderService.getOrder(orderId);
        if(order != null){
            return new ResponseEntity(order, HttpStatus.OK);
        }
        return new ResponseEntity<Order>(HttpStatus.NOT_FOUND);
    }

    /**
     * Create new order
     * @param orderInfo order to be created
     * @response 201
     * @response 400
     * @return Created order
     */
    @RequestMapping(path = "", method = RequestMethod.POST)
    public ResponseEntity<Order> createOrder(@RequestBody OrderInfo orderInfo) {
        Order order = orderService.createOrder(orderInfo);
        if(order != null){
            return new ResponseEntity<Order>(order, HttpStatus.CREATED);
        }
        return new ResponseEntity<Order>(HttpStatus.BAD_REQUEST);
    }

    /**
     * Update order status
     * @param orderId id of the order
     * @param status new order status
     * @response 200
     * @response 404
     * @return Order with the new status
     */
    @RequestMapping(path="/{orderId}/status", method = RequestMethod.PUT)
    public ResponseEntity<Order> updateStatus(@PathVariable("orderId") Long orderId, @RequestParam("status") OrderStatus status){
        Order order = orderService.updateStatus(orderId, status);
        if(order != null){
            return new ResponseEntity<Order>(order, HttpStatus.OK);
        }
        return new ResponseEntity<Order>(HttpStatus.NOT_FOUND);
    }


}
