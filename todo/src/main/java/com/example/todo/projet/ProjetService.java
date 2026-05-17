package com.example.todo.projet;

import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import com.example.todo.client.Client;
import com.example.todo.client.ClientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjetService {

    private final ProjetRepository projetRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    public ProjetService(ProjetRepository projetRepository,
                         UserRepository userRepository,
                         ClientRepository clientRepository) {
        this.projetRepository = projetRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
    }

    // recup tous les projets du user
    public List<Projet> getAllProjets(String username) {
        return projetRepository.findByOwnerUsername(username);
    }

    // projets d'un client specifique
    public List<Projet> getProjetsByClient(Long clientId, String username) {
        return projetRepository.findByClientIdAndOwnerUsername(clientId, username);
    }

    // count pour le dashboard
    public long countProjets(String username) {
        return projetRepository.countByOwnerUsername(username);
    }

    public Projet createProjet(Projet projet, Long clientId, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User introuvable"));
        projet.setOwner(owner);

        if (clientId != null) {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
            projet.setClient(client);
        }

        return projetRepository.save(projet);
    }

    public Projet updateProjet(Long id, Projet updated, String username) {
        Projet existing = projetRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new RuntimeException("Projet introuvable ou acces refuse"));
        existing.setTitre(updated.getTitre());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setDateDebut(updated.getDateDebut());
        existing.setDateFin(updated.getDateFin());
        existing.setDomaine(updated.getDomaine());
        existing.setDomaineCustom(updated.getDomaineCustom());
        return projetRepository.save(existing);
    }

    public Projet updateStatus(Long id, ProjetStatus status, String username) {
        Projet projet = projetRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new RuntimeException("Projet introuvable ou acces refuse"));
        projet.setStatus(status);
        return projetRepository.save(projet);
    }

    public void deleteProjet(Long id, String username) {
        Projet projet = projetRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new RuntimeException("Projet introuvable ou acces refuse"));
        projetRepository.deleteById(projet.getId());
    }
}
