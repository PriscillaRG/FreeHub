package com.example.todo.task;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.example.todo.auth.User;
import com.example.todo.projet.Projet;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate dueDate;
    private boolean completed = false;

    // lien vers le projet
    @ManyToOne
    @JoinColumn(name = "projet_id")
    private Projet projet;

    // proprietaire
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    // utilisateurs assignes
    @ManyToMany
    @JoinTable(
        name = "task_assigned_users",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> assignedUsers = new HashSet<>();

    // getters / setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Projet getProjet() { return projet; }
    public void setProjet(Projet projet) { this.projet = projet; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public Set<User> getAssignedUsers() { return assignedUsers; }
    public void setAssignedUsers(Set<User> assignedUsers) { this.assignedUsers = assignedUsers; }
}
