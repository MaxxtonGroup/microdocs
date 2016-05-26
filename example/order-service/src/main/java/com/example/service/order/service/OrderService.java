package com.example.service.order.service;

import com.example.service.order.client.CustomerClient;
import com.example.service.order.domain.Order;
import com.example.service.order.domain.OrderInfo;
import com.example.service.order.domain.OrderStatus;
import com.example.service.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@Service
public class OrderService {

    @Autowired
    private CustomerClient customerClient;

    @Autowired
    private OrderRepository orderRepository;

    public Page<Order> getOrders(Pageable pageable){
        Page<OrderInfo> orderInfos = orderRepository.findAll(pageable);
        List<Order> orders = new ArrayList();
        orderInfos.forEach(orderInfo -> {
            orders.add(getOrder(orderInfo));
        });
        return new PageImpl(orders, pageable, orderInfos.getTotalElements());
    }

    public Order getOrder(Long orderId){
        OrderInfo orderInfo = orderRepository.findOne(orderId);
        return getOrder(orderInfo);
    }

    private Order getOrder(OrderInfo orderInfo) {
        Order order = new Order();
        order.setOrderDate(orderInfo.getOrderDate());
        order.setStatus(orderInfo.getStatus());
        order.setOrderId(orderInfo.getOrderId());
        order.setCustomer(customerClient.getCustomer(orderInfo.getCustomerId()));
        order.setStatus(orderInfo.getStatus());
        return order;
    }

    public Order updateStatus(Long orderId, OrderStatus status) {
        OrderInfo orderInfo = orderRepository.findOne(orderId);
        if(orderInfo != null){
            orderInfo.setStatus(status);
            orderRepository.save(orderInfo);
            return getOrder(orderInfo);
        }
        return null;
    }

    public Order createOrder(OrderInfo orderInfo) {
        Order order = getOrder(orderInfo);
        if(order.getCustomer() == null){
            return null;
        }
        orderInfo = orderRepository.save(orderInfo);
        order.setOrderId(orderInfo.getOrderId());
        return order;
    }
}
