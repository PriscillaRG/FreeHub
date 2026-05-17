package com.example.todo.prestation;

import com.example.todo.auth.User;
import com.example.todo.client.Client;
import com.example.todo.projet.Projet;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "prestations")
public class Prestation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private PrestationType type = PrestationType.AUTRE;

    @Enumerated(EnumType.STRING)
    private PrestationStatus status = PrestationStatus.EN_ATTENTE;

    private BigDecimal price;
    private LocalDate dueDate;

    // lien vers le client
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    // lien vers le projet parent (optionnel pour compat)
    @ManyToOne
    @JoinColumn(name = "projet_id")
    private Projet projet;

    // proprio
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    // getters / setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PrestationType getType() { return type; }
    public void setType(PrestationType type) { this.type = type; }

    public PrestationStatus getStatus() { return status; }
    public void setStatus(PrestationStatus status) { this.status = status; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public Projet getProjet() { return projet; }
    public void setProjet(Projet projet) { this.projet = projet; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
}
