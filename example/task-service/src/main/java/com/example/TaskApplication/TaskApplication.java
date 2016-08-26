package com.example.TaskApplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * This Microservice owns all the Tasks
 *
 * @author S. Hermans (s.hermans@maxxton.com)
 */
@SpringBootApplication
public class TaskApplication {

    public static void main(String[] args){
        SpringApplication.run(TaskApplication.class, args);
    }

}
