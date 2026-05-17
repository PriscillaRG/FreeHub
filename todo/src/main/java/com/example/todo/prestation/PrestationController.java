package com.example.todo.prestation;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prestations")
@CrossOrigin(origins = "http://localhost:4200")
public class PrestationController {

    private final PrestationService prestationService;

    public PrestationController(PrestationService prestationService) {
        this.prestationService = prestationService;
    }

    // Toutes les prestations de l'utilisateur connecté
    @GetMapping
    public List<Prestation> getAllPrestations(Authentication authentication) {
        return prestationService.getAllPrestations(authentication.getName());
    }

    // Prestations d'un client spécifique
    @GetMapping("/client/{clientId}")
    public List<Prestation> getPrestationsByClient(@PathVariable Long clientId,
                                                    Authentication authentication) {
        return prestationService.getPrestationsByClient(clientId, authentication.getName());
    }

    // Créer une prestation (avec clientId optionnel)
    @PostMapping
    public Prestation createPrestation(@RequestBody Prestation prestation,
                                       @RequestParam(required = false) Long clientId,
                                       Authentication authentication) {
        return prestationService.createPrestation(prestation, clientId, authentication.getName());
    }

    // Modifier une prestation
    @PutMapping("/{id}")
    public Prestation updatePrestation(@PathVariable Long id,
                                       @RequestBody Prestation prestation,
                                       Authentication authentication) {
        return prestationService.updatePrestation(id, prestation, authentication.getName());
    }

    // Changer uniquement le statut
    @PatchMapping("/{id}/status")
    public Prestation updateStatus(@PathVariable Long id,
                                   @RequestBody Map<String, String> body,
                                   Authentication authentication) {
        PrestationStatus status = PrestationStatus.valueOf(body.get("status"));
        return prestationService.updateStatus(id, status, authentication.getName());
    }

    // Supprimer une prestation
    @DeleteMapping("/{id}")
    public void deletePrestation(@PathVariable Long id, Authentication authentication) {
        prestationService.deletePrestation(id, authentication.getName());
    }
}
