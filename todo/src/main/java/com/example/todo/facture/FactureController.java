package com.example.todo.facture;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "http://localhost:4200")
public class FactureController {

    private final FactureService factureService;

    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }

    // toutes les factures du user
    @GetMapping
    public List<Facture> getAll(Authentication auth) {
        return factureService.getAllFactures(auth.getName());
    }

    // creer une facture
    @PostMapping
    public Facture create(@RequestBody Facture facture,
                          @RequestParam(required = false) Long clientId,
                          @RequestParam(required = false) Long projetId,
                          Authentication auth) {
        return factureService.createFacture(facture, clientId, projetId, auth.getName());
    }

    // changer le statut
    @PatchMapping("/{id}/status")
    public Facture updateStatus(@PathVariable Long id,
                                @RequestBody Map<String, String> body,
                                Authentication auth) {
        FactureStatus status = FactureStatus.valueOf(body.get("status"));
        return factureService.updateStatus(id, status, auth.getName());
    }

    // supprimer
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        factureService.deleteFacture(id, auth.getName());
    }
}
