package com.example.service.order.service;

import com.example.service.order.client.CustomerClient;
import com.example.service.order.domain.Order;
import com.example.service.order.domain.OrderInfo;
import com.example.service.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 25-5-2016.
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

    private Order getOrder(OrderInfo orderInfo) {
        Order order = new Order();
        order.setOrderDate(orderInfo.getOrderDate());
        order.setOrderId(orderInfo.getOrderId());
        order.setCustomer(customerClient.getCustomer(orderInfo.getCustomerId()));
        return order;
    }

}
