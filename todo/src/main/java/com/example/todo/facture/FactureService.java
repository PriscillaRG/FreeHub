package com.example.todo.facture;

import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import com.example.todo.client.Client;
import com.example.todo.client.ClientRepository;
import com.example.todo.projet.Projet;
import com.example.todo.projet.ProjetRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class FactureService {

    private final FactureRepository factureRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final ProjetRepository projetRepository;

    public FactureService(FactureRepository factureRepository,
                          UserRepository userRepository,
                          ClientRepository clientRepository,
                          ProjetRepository projetRepository) {
        this.factureRepository = factureRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.projetRepository = projetRepository;
    }

    public List<Facture> getAllFactures(String username) {
        return factureRepository.findByOwnerUsernameOrderByDateEmissionDesc(username);
    }

    public Facture createFacture(Facture facture, Long clientId, Long projetId, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User introuvable"));
        facture.setOwner(owner);

        if (clientId != null) {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
            facture.setClient(client);
        }

        if (projetId != null) {
            Projet projet = projetRepository.findById(projetId)
                    .orElseThrow(() -> new RuntimeException("Projet introuvable"));
            facture.setProjet(projet);
        }

        // date emission auto si pas fournie
        if (facture.getDateEmission() == null) {
            facture.setDateEmission(LocalDate.now());
        }

        // numero auto : FAC-YYYY-NNN
        int year = facture.getDateEmission().getYear();
        long count = factureRepository.countByOwnerAndYear(username, year) + 1;
        facture.setNumero(String.format("FAC-%d-%03d", year, count));

        return factureRepository.save(facture);
    }

    public Facture updateStatus(Long id, FactureStatus status, String username) {
        Facture facture = factureRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));
        facture.setStatus(status);
        return factureRepository.save(facture);
    }

    public void deleteFacture(Long id, String username) {
        Facture facture = factureRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));
        factureRepository.deleteById(facture.getId());
    }
}
