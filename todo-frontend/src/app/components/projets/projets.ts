import { Component, OnInit } from '@angular/core';
import { SidebarToggleComponent } from '../sidebar-toggle/sidebar-toggle';
import { BottomNavComponent } from '../bottom-nav/bottom-nav';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProjetService, Projet } from '../../services/projet.service';
import { ClientService, Client } from '../../services/client.service';

// composant projets -- CRUD + liaison avec les clients
@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [ CommonModule, BottomNavComponent, SidebarToggleComponent, FormsModule, RouterModule],
  templateUrl: './projets.html',
  styleUrls: ['./projets.css']
})
export class ProjetsComponent implements OnInit {

  projets: Projet[] = [];
  clients: Client[] = [];     // liste des clients pour le select dans le form
  showForm = false;           // affiche ou masque le formulaire de creation
  editMode: Projet | null = null;   // projet en cours de modification

  // infos du user (extraites du token JWT)
  username = '';
  role = '';
  sidebarOpen = true;

  // modele pour le formulaire de creation
  newProjet: Projet = { titre: '', description: '', status: 'EN_ATTENTE', domaine: '' };
  selectedClientId: number | null = null;   // client selectionne dans le form

  // listes d'options pour les selects
  domaines = ['Logo', 'Illustration', 'Site Web', 'Code', 'Maquette', 'Photographie', 'Video', 'Redaction', 'Autre'];
  statuts = ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'ANNULE'];

  constructor(
    private projetService: ProjetService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // decode manuellement le token JWT pour recup username et role
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.sub || '';
        this.role = payload.role || 'USER';
      } catch (e) {
        // si le decode plante on laisse vide
      }
    }

    this.chargerProjets();

    // charge aussi les clients pour le select dans le form
    this.clientService.getClients().subscribe({
      next: (data) => { this.clients = data; },
      error: () => {}
    });
  }

  // charge tous les projets de l'utilisateur
  chargerProjets(): void {
    this.projetService.getProjets().subscribe({
      next: (data) => { this.projets = data; },
      error: () => {}
    });
  }

  // cree un nouveau projet
  add(): void {
    if (!this.newProjet.titre.trim()) return;  // titre obligatoire

    const clientId = this.selectedClientId ?? undefined;
    this.projetService.addProjet(this.newProjet, clientId).subscribe(() => {
      // reset le formulaire apres creation
      this.newProjet = { titre: '', description: '', status: 'EN_ATTENTE', domaine: '' };
      this.selectedClientId = null;
      this.showForm = false;
      this.chargerProjets();
    });
  }

  // ouvre le modal d'edition pour un projet (clic sur la ligne)
  startEdit(p: Projet, event: Event): void {
    event.stopPropagation();
    // clone l'objet pour pas toucher a la liste directement
    this.editMode = { ...p };
  }

  // sauvegarde les modifs
  saveEdit(): void {
    if (!this.editMode || !this.editMode.id) return;
    this.projetService.updateProjet(this.editMode.id, this.editMode).subscribe(() => {
      this.editMode = null;
      this.chargerProjets();
    });
  }

  // annule l'edition
  cancelEdit(): void {
    this.editMode = null;
  }

  // met a jour uniquement le statut d'un projet
  changeStatus(p: Projet, status: string): void {
    if (!p.id) return;
    this.projetService.updateStatus(p.id, status).subscribe(() => this.chargerProjets());
  }

  // supprime un projet
  delete(id: number | undefined, event: Event): void {
    event.stopPropagation();  // empeche l'ouverture du modal d'edition
    if (!id) return;
    this.projetService.deleteProjet(id).subscribe(() => {
      if (this.editMode?.id === id) this.editMode = null;
      this.chargerProjets();
    });
  }

  // initiales pour l'avatar sidebar
  get initials(): string {
    return this.username ? this.username.slice(0, 2).toUpperCase() : 'FH';
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // retourne la classe CSS selon le statut (pour colorer le badge)
  getStatusClass(status: string): string {
    return 'status-' + (status || '');
  }

  // retourne le nom du client associe au projet
  getClientName(p: Projet): string {
    return p.client?.name || '';
  }

  // si domaine = "Autre" on affiche le texte saisi par l'utilisateur
  getDomaineLabel(p: Projet): string {
    if (!p.domaine) return '';
    if (p.domaine === 'Autre' && p.domaineCustom) return p.domaineCustom;
    return p.domaine;
  }
}
