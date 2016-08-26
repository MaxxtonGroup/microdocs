package com.example.TaskApplication.controller;

import com.example.TaskApplication.domain.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Task Controller
 * @author Steven Hermans (s.hermans@maxxton.com)
 */
@RestController
public class TaskController {

    /**
     * Update and existing task
     *
     * @param taskId Id of the existing task
     * @param author The name of the author which is editing the task
     * @param newTask The new task resource
     *
     * @response 200 The task has succesfully updated
     * @response 404 The resource doesn't exists
     *
     * @return The new task
     */
    @RequestMapping(method = RequestMethod.PUT, path = "/api/v1/tasks/{taskId}")
    public Task updateTask(
            @PathVariable("taskId") Long taskId,
            @RequestParam(value = "someAuthorId", required = false) Long author,
            @RequestBody Task newTask){
        // do stuff
        if(exists){
            return newTask;
        }else{
            throw new BadRequestException();
        }
    }


}
