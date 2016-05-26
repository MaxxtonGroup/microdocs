package com.example.service.order.repository;

import com.example.service.order.domain.OrderInfo;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by steve on 25-5-2016.
 */
@Repository
public interface OrderRepository extends PagingAndSortingRepository<OrderInfo, Long> {
}
