package com.example.todo.facture;

import com.example.todo.auth.User;
import com.example.todo.client.Client;
import com.example.todo.projet.Projet;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "factures")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // numero auto-genere (ex: FAC-2025-001)
    private String numero;

    @Enumerated(EnumType.STRING)
    private FactureStatus status = FactureStatus.BROUILLON;

    private BigDecimal montant;
    private BigDecimal tva = BigDecimal.ZERO; // taux en %

    private LocalDate dateEmission;
    private LocalDate dateEcheance;

    @Column(columnDefinition = "TEXT")
    private String description;

    // lien client
    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnoreProperties({"prestations", "owner"})
    private Client client;

    // lien projet (optionnel)
    @ManyToOne
    @JoinColumn(name = "projet_id")
    @JsonIgnoreProperties({"prestations", "tasks", "owner"})
    private Projet projet;

    // proprio
    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonIgnoreProperties({"password"})
    private User owner;

    // getters / setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public FactureStatus getStatus() { return status; }
    public void setStatus(FactureStatus status) { this.status = status; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public BigDecimal getTva() { return tva; }
    public void setTva(BigDecimal tva) { this.tva = tva; }

    public LocalDate getDateEmission() { return dateEmission; }
    public void setDateEmission(LocalDate dateEmission) { this.dateEmission = dateEmission; }

    public LocalDate getDateEcheance() { return dateEcheance; }
    public void setDateEcheance(LocalDate dateEcheance) { this.dateEcheance = dateEcheance; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public Projet getProjet() { return projet; }
    public void setProjet(Projet projet) { this.projet = projet; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
}
