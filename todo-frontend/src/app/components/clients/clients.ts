import { Component, OnInit } from '@angular/core';
import { SidebarToggleComponent } from '../sidebar-toggle/sidebar-toggle';
import { BottomNavComponent } from '../bottom-nav/bottom-nav';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ClientService, Client } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

// composant pour la gestion des clients
// CRUD complet : creation, lecture, modification, suppression
@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ CommonModule, BottomNavComponent, SidebarToggleComponent, FormsModule, RouterModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class ClientsComponent implements OnInit {

  // liste des clients recuperes depuis l'api
  clients: Client[] = [];

  // controle l'affichage du formulaire de creation
  showForm = false;

  // client en cours de modification (null si aucun)
  editMode: Client | null = null;

  // modele vide pour le formulaire d'ajout
  newClient: Client = { name: '', email: '', phone: '' };

  // infos du user connecte (decode depuis le token)
  username: string = '';
  sidebarOpen = true;
  role: string = '';

  private jwtHelper = new JwtHelperService();

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // decode le token pour afficher le nom et le role dans la sidebar
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.username = decoded?.sub || decoded?.username || 'Utilisateur';
      this.role = decoded?.role || 'USER';
    }
    this.chargerClients();
  }

  // charge la liste des clients depuis l'api
  chargerClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => { this.clients = data; },
      error: () => {}
    });
  }

  // ajoute un nouveau client
  add(): void {
    if (!this.newClient.name.trim()) return;   // nom obligatoire
    this.clientService.addClient(this.newClient).subscribe(() => {
      // reinitialise le form et recharge la liste
      this.newClient = { name: '', email: '', phone: '' };
      this.showForm = false;
      this.chargerClients();
    });
  }

  // ouvre le modal d'edition pour un client
  startEdit(c: Client): void {
    // on fait une copie pour pas modifier la liste directement
    this.editMode = { ...c };
    this.showForm = false;
  }

  // sauvegarde les modifs du client en cours d'edition
  saveEdit(): void {
    if (!this.editMode || !this.editMode.id) return;
    this.clientService.updateClient(this.editMode.id, this.editMode).subscribe(() => {
      this.editMode = null;
      this.chargerClients();
    });
  }

  // ferme le modal sans sauvegarder
  cancelEdit(): void {
    this.editMode = null;
  }

  // supprime un client par son id
  delete(id: number): void {
    this.clientService.deleteClient(id).subscribe(() => {
      // si on etait en train de modifier ce client, on ferme le modal
      if (this.editMode?.id === id) this.editMode = null;
      this.chargerClients();
    });
  }

  // genere les initiales d'un nom (ex: "Marie Dupont" → "MD")
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  // initiales pour l'avatar de la sidebar
  get initials(): string {
    return this.username ? this.username.slice(0, 2).toUpperCase() : 'FH';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
