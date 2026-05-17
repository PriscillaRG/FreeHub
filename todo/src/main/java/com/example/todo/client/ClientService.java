package com.example.todo.client;

import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientService(ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    public List<Client> getAllClients(String username) {
        return clientRepository.findByOwnerUsername(username);
    }

    public Client createClient(Client client, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        client.setOwner(owner);
        return clientRepository.save(client);
    }

    public Client updateClient(Long id, Client updated, String username) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
        if (!existing.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Accès refusé");
        }
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setNotes(updated.getNotes());
        return clientRepository.save(existing);
    }

    public void deleteClient(Long id, String username) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
        if (!existing.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Accès refusé");
        }
        clientRepository.deleteById(id);
    }

    public Client getClientById(Long id, String username) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
        if (!client.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Accès refusé");
        }
        return client;
    }
}
