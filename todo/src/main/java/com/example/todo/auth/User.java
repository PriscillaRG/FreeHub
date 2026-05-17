package com.example.todo.auth;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String role = "USER"; // par defaut

    // infos profil
    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    // date de naissance (format yyyy-MM-dd)
    private String dateOfBirth;

    // preferences inscription
    private boolean newsletterOptIn = false;
    private boolean cgAccepted = false;

    // getters / setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public boolean isNewsletterOptIn() { return newsletterOptIn; }
    public void setNewsletterOptIn(boolean newsletterOptIn) { this.newsletterOptIn = newsletterOptIn; }

    public boolean isCgAccepted() { return cgAccepted; }
    public void setCgAccepted(boolean cgAccepted) { this.cgAccepted = cgAccepted; }
}
