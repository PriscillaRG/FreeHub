import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { FactureService } from '../../services/facture.service';
import { ProjetService } from '../../services/projet.service';

// interface pour typer les resultats de la recherche
export interface SearchResult {
  type: 'client' | 'facture' | 'projet';
  label: string;
  sub: string;
  route: string;
  id?: number;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBarComponent implements OnInit {

  open = false;        // panel ouvert ou pas
  query = '';          // texte saisi par l'utilisateur
  results: SearchResult[] = [];   // resultats filtres
  loading = false;     // indicateur de chargement

  // donnees brutes recuperees depuis l'api (chargees une seule fois)
  private clients: any[] = [];
  private factures: any[] = [];
  private projets: any[] = [];

  // timer pour le debounce (pas de rxjs, on fait ca simplement)
  private timer: any = null;

  constructor(
    private clientService: ClientService,
    private factureService: FactureService,
    private projetService: ProjetService,
    private router: Router
  ) {}

  // charge toutes les donnees au demarrage du composant
  ngOnInit(): void {
    this.chargerDonnees();
  }

  // recup les donnees depuis le back (clients, factures, projets)
  private chargerDonnees(): void {
    this.clientService.getClients().subscribe({
      next: (data) => { this.clients = data; },
      error: () => { this.clients = []; }   // si ca plante on garde un tableau vide
    });

    this.factureService.getFactures().subscribe({
      next: (data) => { this.factures = data; },
      error: () => { this.factures = []; }
    });

    this.projetService.getProjets().subscribe({
      next: (data) => { this.projets = data; },
      error: () => { this.projets = []; }
    });
  }

  // ouvre ou ferme le panel de recherche
  toggleOpen(): void {
    this.open = !this.open;
    if (this.open) {
      // focus automatique sur le champ texte
      setTimeout(() => {
        const input = document.getElementById('global-search-input') as HTMLInputElement;
        if (input) input.focus();
      }, 60);
    } else {
      this.reset();
    }
  }

  // declenche a chaque frappe dans l'input
  onInput(): void {
    // debounce maison -- on attend 300ms avant de lancer la recherche
    // ca evite de filtrer a chaque lettre tapee
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.filtrer();
    }, 300);
  }

  // filtre les donnees selon la query
  private filtrer(): void {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      this.results = [];
      return;
    }

    const res: SearchResult[] = [];

    // --- clients ---
    this.clients
      .filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach(c => res.push({
        type: 'client',
        label: c.name || 'Client sans nom',
        sub: [c.company, c.email].filter(Boolean).join(' · '),
        route: '/clients',
        id: c.id
      }));

    // --- factures ---
    this.factures
      .filter(f =>
        (f.numero || '').toLowerCase().includes(q) ||
        (f.status || '').toLowerCase().includes(q) ||
        String(f.montant || '').includes(q)
      )
      .slice(0, 4)
      .forEach(f => res.push({
        type: 'facture',
        label: f.numero || 'Facture',
        sub: [f.status, f.montant != null ? f.montant + ' €' : ''].filter(Boolean).join(' · '),
        route: '/factures',
        id: f.id
      }));

    // --- projets ---
    this.projets
      .filter(p =>
        (p.titre || '').toLowerCase().includes(q) ||
        (p.status || '').toLowerCase().includes(q) ||
        (p.domaine || '').toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach(p => res.push({
        type: 'projet',
        label: p.titre || 'Projet',
        sub: [p.domaine, p.status].filter(Boolean).join(' · '),
        route: '/projets',
        id: p.id
      }));

    this.results = res;
  }

  // navigue vers la page correspondante au resultat
  goTo(r: SearchResult): void {
    this.close();
    this.router.navigate([r.route]);
  }

  close(): void {
    this.open = false;
    this.reset();
  }

  // reinitialise le composant
  private reset(): void {
    this.query = '';
    this.results = [];
    clearTimeout(this.timer);
  }

  // labels affiches dans les groupes de resultats
  typeLabel: Record<string, string> = {
    client: 'Clients',
    facture: 'Factures',
    projet: 'Projets'
  };

  typeIcon: Record<string, string> = {
    client: '👤',
    facture: '🧾',
    projet: '📁'
  };

  // regroupe les resultats par type (client / facture / projet)
  get groupedResults(): { type: string; items: SearchResult[] }[] {
    const groupes: Record<string, SearchResult[]> = {};
    for (const r of this.results) {
      if (!groupes[r.type]) groupes[r.type] = [];
      groupes[r.type].push(r);
    }
    return Object.entries(groupes).map(([type, items]) => ({ type, items }));
  }
}
