package com.example.todo.projet;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projets")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjetController {

    private final ProjetService projetService;

    public ProjetController(ProjetService projetService) {
        this.projetService = projetService;
    }

    // tous les projets du user connecte
    @GetMapping
    public List<Projet> getAllProjets(Authentication auth) {
        return projetService.getAllProjets(auth.getName());
    }

    // projets d'un client
    @GetMapping("/client/{clientId}")
    public List<Projet> getProjetsByClient(@PathVariable Long clientId, Authentication auth) {
        return projetService.getProjetsByClient(clientId, auth.getName());
    }

    // nb de projets pour le dashboard
    @GetMapping("/count")
    public Map<String, Long> countProjets(Authentication auth) {
        return Map.of("count", projetService.countProjets(auth.getName()));
    }

    // creer un projet
    @PostMapping
    public Projet createProjet(@RequestBody Projet projet,
                               @RequestParam(required = false) Long clientId,
                               Authentication auth) {
        return projetService.createProjet(projet, clientId, auth.getName());
    }

    // modifier un projet
    @PutMapping("/{id}")
    public Projet updateProjet(@PathVariable Long id,
                               @RequestBody Projet projet,
                               Authentication auth) {
        return projetService.updateProjet(id, projet, auth.getName());
    }

    // changer le statut
    @PatchMapping("/{id}/status")
    public Projet updateStatus(@PathVariable Long id,
                               @RequestBody Map<String, String> body,
                               Authentication auth) {
        ProjetStatus status = ProjetStatus.valueOf(body.get("status"));
        return projetService.updateStatus(id, status, auth.getName());
    }

    // supprimer un projet
    @DeleteMapping("/{id}")
    public void deleteProjet(@PathVariable Long id, Authentication auth) {
        projetService.deleteProjet(id, auth.getName());
    }
}
