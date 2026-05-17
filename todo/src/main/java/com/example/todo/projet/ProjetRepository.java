package com.example.todo.projet;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProjetRepository extends JpaRepository<Projet, Long> {

    // tous les projets d'un user
    List<Projet> findByOwnerUsername(String username);

    // projets d'un client
    List<Projet> findByClientIdAndOwnerUsername(Long clientId, String username);

    // recup un projet par id + owner (securite)
    Optional<Projet> findByIdAndOwnerUsername(Long id, String username);

    // count pour le dashboard
    long countByOwnerUsername(String username);
}
