package com.example.todo.client;

import com.example.todo.auth.User;
import com.example.todo.prestation.Prestation;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String email;
    private String phone;

    // societe ou agence rattachee au client
    private String company;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Le freelance proprietaire de ce client
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    // Toutes les prestations liees a ce client
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Prestation> prestations;

    // getters / setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public List<Prestation> getPrestations() { return prestations; }
    public void setPrestations(List<Prestation> prestations) { this.prestations = prestations; }
}
