import { Component, OnInit } from '@angular/core';
import { SidebarToggleComponent } from '../sidebar-toggle/sidebar-toggle';
import { BottomNavComponent } from '../bottom-nav/bottom-nav';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FactureService, Facture } from '../../services/facture.service';
import { ClientService, Client } from '../../services/client.service';
import { ProjetService, Projet } from '../../services/projet.service';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [ CommonModule, BottomNavComponent, SidebarToggleComponent, FormsModule, RouterModule],
  templateUrl: './factures.html',
  styleUrls: ['./factures.css']
})
export class FacturesComponent implements OnInit {

  factures: Facture[] = [];
  clients: Client[] = [];
  projets: Projet[] = [];
  showForm = false;
  viewFacture: Facture | null = null;
  showShare: Facture | null = null;

  newFacture: Facture = { montant: 0, tva: 0, description: '' };
  selectedClientId: number | null = null;
  selectedProjetId: number | null = null;

  statuts = ['BROUILLON', 'ENVOYEE', 'PAYEE', 'EN_RETARD', 'ANNULEE'];

  username: string = '';
  sidebarOpen = true;

  role: string = '';

  constructor(
    private factureService: FactureService,
    private clientService: ClientService,
    private projetService: ProjetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // recup infos user depuis le token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.sub || payload.username || 'Utilisateur';
        this.role = payload.role || 'USER';
      } catch (e) {}
    }
    this.load();
    this.clientService.getClients().subscribe({ next: c => this.clients = c, error: () => {} });
    this.projetService.getProjets().subscribe({ next: p => this.projets = p, error: () => {} });
  }

  get initials(): string {
    return this.username ? this.username.slice(0, 2).toUpperCase() : 'FH';
  }

  load() {
    this.factureService.getFactures().subscribe({ next: f => this.factures = f, error: () => {} });
  }

  create() {
    if (!this.newFacture.montant) return;
    const clientId = this.selectedClientId ?? undefined;
    const projetId = this.selectedProjetId ?? undefined;
    this.factureService.createFacture(this.newFacture, clientId, projetId).subscribe(() => {
      this.newFacture = { montant: 0, tva: 0, description: '' };
      this.selectedClientId = null;
      this.selectedProjetId = null;
      this.showForm = false;
      this.load();
    });
  }

  changeStatus(f: Facture, status: string) {
    if (!f.id) return;
    this.factureService.updateStatus(f.id, status).subscribe(() => this.load());
  }

  delete(id: number | undefined) {
    if (!id) return;
    this.factureService.deleteFacture(id).subscribe(() => this.load());
  }

  // total TTC
  totalTTC(f: Facture): number {
    const ht = f.montant || 0;
    const tva = f.tva || 0;
    return ht * (1 + tva / 100);
  }

  print(f: Facture) {
    this.viewFacture = f;
    setTimeout(() => window.print(), 400);
  }

  shareByMail(f: Facture) {
    const subject = encodeURIComponent(`Facture ${f.numero} - FreeHub`);
    const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint la facture ${f.numero} d'un montant de ${this.totalTTC(f).toFixed(2)} €.\n\nCordialement`);
    window.open(`mailto:${f.client?.email || ''}?subject=${subject}&body=${body}`);
    this.showShare = null;
  }

  getStatusClass(status: string): string {
    return 'fac-status-' + (status || '');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
