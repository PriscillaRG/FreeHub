package com.example.todo.task;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public List<Task> getTasks(Authentication authentication) {
        return service.getTasksByUser(authentication.getName());
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, Authentication authentication) {
        return service.createTask(task, authentication.getName());
    }

    @PostMapping("/{id}/assign")
    public Task assignUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String username = body.get("username");
        return service.assignUser(id, username);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task, Authentication authentication) {
        task.setId(id);
        return service.update(task, authentication.getName());
    }

    @PatchMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id, Authentication authentication) {
        return service.markAsCompleted(id, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id, Authentication authentication) {
        service.delete(id, authentication.getName());
    }

    @PostMapping("/{id}/remove")
public Task removeUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
    String username = body.get("username");
    return service.removeUser(id, username);
}

}
