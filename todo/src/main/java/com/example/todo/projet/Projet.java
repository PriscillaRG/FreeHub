package com.example.todo.projet;

import com.example.todo.auth.User;
import com.example.todo.client.Client;
import com.example.todo.prestation.Prestation;
import com.example.todo.task.Task;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "projets")
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjetStatus status = ProjetStatus.EN_ATTENTE;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    // domaine du projet (logo, illustration, web, code, etc.)
    private String domaine;

    // si domaine = AUTRE, texte libre
    private String domaineCustom;

    // lien vers le client
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    // proprio du projet
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    // prestations liees au projet
    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Prestation> prestations;

    // taches liees au projet
    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Task> tasks;

    // getters / setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProjetStatus getStatus() { return status; }
    public void setStatus(ProjetStatus status) { this.status = status; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public String getDomaine() { return domaine; }
    public void setDomaine(String domaine) { this.domaine = domaine; }

    public String getDomaineCustom() { return domaineCustom; }
    public void setDomaineCustom(String domaineCustom) { this.domaineCustom = domaineCustom; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public List<Prestation> getPrestations() { return prestations; }
    public void setPrestations(List<Prestation> prestations) { this.prestations = prestations; }

    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }
}
