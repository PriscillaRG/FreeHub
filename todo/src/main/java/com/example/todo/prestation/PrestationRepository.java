package com.example.todo.prestation;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrestationRepository extends JpaRepository<Prestation, Long> {
    List<Prestation> findByOwnerUsername(String username);
    List<Prestation> findByClientIdAndOwnerUsername(Long clientId, String username);
}
