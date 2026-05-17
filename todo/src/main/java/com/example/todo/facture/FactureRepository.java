package com.example.todo.facture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FactureRepository extends JpaRepository<Facture, Long> {

    List<Facture> findByOwnerUsernameOrderByDateEmissionDesc(String username);

    Optional<Facture> findByIdAndOwnerUsername(Long id, String username);

    // recup le dernier numero pour auto-incrementer
    @Query("SELECT COUNT(f) FROM Facture f WHERE f.owner.username = :username AND YEAR(f.dateEmission) = :year")
    long countByOwnerAndYear(@Param("username") String username, @Param("year") int year);
}
