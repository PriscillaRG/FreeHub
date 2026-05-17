package com.example.todo;

import com.example.todo.auth.User;
import com.example.todo.auth.UserRepository;
import com.example.todo.client.Client;
import com.example.todo.client.ClientRepository;
import com.example.todo.client.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// tests unitaires du ClientService
// on utilise Mockito pour simuler les repositories
// comme ca on teste juste la logique metier, sans base de donnees
@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    // mock du repository client (simule la base de donnees)
    @Mock
    private ClientRepository clientRepository;

    // mock du repository user (pour recup le proprietaire)
    @Mock
    private UserRepository userRepository;

    // le service qu'on veut tester (les mocks sont injectes dedans)
    @InjectMocks
    private ClientService clientService;

    // donnees de test reutilisees dans plusieurs tests
    private User userTest;
    private Client clientTest;

    @BeforeEach
    void setUp() {
        // creation d'un utilisateur de test
        userTest = new User();
        userTest.setUsername("priscilla");
        userTest.setPassword("secret");
        userTest.setRole("USER");

        // creation d'un client de test
        clientTest = new Client();
        clientTest.setId(1L);
        clientTest.setName("Marie Dupont");
        clientTest.setEmail("marie@test.fr");
        clientTest.setPhone("0612345678");
        clientTest.setOwner(userTest);
    }

    // --- TEST 1 ---
    // verifie que getAllClients retourne bien la liste des clients de l'utilisateur
    @Test
    void testGetAllClients_retourneLaListe() {
        // on simule ce que retournerait le repository
        when(clientRepository.findByOwnerUsername("priscilla"))
            .thenReturn(List.of(clientTest));

        // appel de la methode a tester
        List<Client> result = clientService.getAllClients("priscilla");

        // verification
        assertEquals(1, result.size());
        assertEquals("Marie Dupont", result.get(0).getName());
        verify(clientRepository, times(1)).findByOwnerUsername("priscilla");
    }

    // --- TEST 2 ---
    // verifie que createClient sauvegarde bien le client avec le bon proprietaire
    @Test
    void testCreateClient_sauvegardeLeClient() {
        // setup : le user existe en base
        when(userRepository.findByUsername("priscilla"))
            .thenReturn(Optional.of(userTest));
        // le repository retourne le client apres sauvegarde
        when(clientRepository.save(any(Client.class)))
            .thenReturn(clientTest);

        Client nouveau = new Client();
        nouveau.setName("Jean Martin");
        nouveau.setEmail("jean@test.fr");

        Client result = clientService.createClient(nouveau, "priscilla");

        // verification que le client a ete sauvegarde
        assertNotNull(result);
        verify(clientRepository, times(1)).save(any(Client.class));
    }

    // --- TEST 3 ---
    // verifie que deleteClient leve une exception si l'utilisateur n'est pas le proprietaire
    @Test
    void testDeleteClient_acceRefuse() {
        // le client appartient a "priscilla" mais on essaie de supprimer avec "autreuser"
        when(clientRepository.findById(1L))
            .thenReturn(Optional.of(clientTest));

        // on attend une RuntimeException avec "Acces refuse"
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            clientService.deleteClient(1L, "autreuser");
        });

        assertTrue(ex.getMessage().contains("refus"));
        // le delete ne doit pas avoir ete appele
        verify(clientRepository, never()).deleteById(any());
    }
}
