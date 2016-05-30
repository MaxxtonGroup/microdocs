package com.example.service.order.repository;

import com.example.service.order.domain.OrderInfo;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@Repository
public interface OrderRepository extends PagingAndSortingRepository<OrderInfo, Long> {
}
