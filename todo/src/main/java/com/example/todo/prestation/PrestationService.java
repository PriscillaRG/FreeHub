package com.example.todo.prestation;

import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import com.example.todo.client.Client;
import com.example.todo.client.ClientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrestationService {

    private final PrestationRepository prestationRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    public PrestationService(PrestationRepository prestationRepository,
                             UserRepository userRepository,
                             ClientRepository clientRepository) {
        this.prestationRepository = prestationRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
    }

    public List<Prestation> getAllPrestations(String username) {
        return prestationRepository.findByOwnerUsername(username);
    }

    public List<Prestation> getPrestationsByClient(Long clientId, String username) {
        return prestationRepository.findByClientIdAndOwnerUsername(clientId, username);
    }

    public Prestation createPrestation(Prestation prestation, Long clientId, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        prestation.setOwner(owner);

        if (clientId != null) {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
            prestation.setClient(client);
        }

        return prestationRepository.save(prestation);
    }

    public Prestation updatePrestation(Long id, Prestation updated, String username) {
        Prestation existing = prestationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestation introuvable"));
        if (!existing.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Accès refusé");
        }
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setType(updated.getType());
        existing.setStatus(updated.getStatus());
        existing.setPrice(updated.getPrice());
        existing.setDueDate(updated.getDueDate());
        return prestationRepository.save(existing);
    }

    public Prestation updateStatus(Long id, PrestationStatus status, String username) {
        Prestation prestation = prestationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestation introuvable"));
        if (!prestation.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Accès refusé");
        }
        prestation.setStatus(status);
        return prestationRepository.save(prestation);
    }

    public void deletePrestation(Long id, String username) {
        Prestation prestation = prestationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestation introuvable"));
        if (!prestation.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Accès refusé");
        }
        prestationRepository.deleteById(id);
    }
}
