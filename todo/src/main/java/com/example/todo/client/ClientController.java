package com.example.todo.client;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public List<Client> getAllClients(Authentication authentication) {
        return clientService.getAllClients(authentication.getName());
    }

    @GetMapping("/{id}")
    public Client getClient(@PathVariable Long id, Authentication authentication) {
        return clientService.getClientById(id, authentication.getName());
    }

    @PostMapping
    public Client createClient(@RequestBody Client client, Authentication authentication) {
        return clientService.createClient(client, authentication.getName());
    }

    @PutMapping("/{id}")
    public Client updateClient(@PathVariable Long id, @RequestBody Client client,
                               Authentication authentication) {
        return clientService.updateClient(id, client, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id, Authentication authentication) {
        clientService.deleteClient(id, authentication.getName());
    }
}
