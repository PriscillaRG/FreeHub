import { Component, OnInit } from '@angular/core';
import { SidebarToggleComponent } from '../sidebar-toggle/sidebar-toggle';
import { BottomNavComponent } from '../bottom-nav/bottom-nav';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-aide',
  standalone: true,
  imports: [ CommonModule, BottomNavComponent, SidebarToggleComponent, RouterModule],
  templateUrl: './aide.html',
  styleUrls: ['./aide.css']
})
export class AideComponent implements OnInit {

  username: string = '';
  sidebarOpen = true;

  role: string = '';

  // FAQ basique
  faqs = [
    {
      q: 'Comment créer un projet ?',
      a: 'Allez dans la section Projets puis cliquez sur "+ Nouveau projet". Remplissez le titre et sélectionnez un client si besoin.',
      open: false
    },
    {
      q: 'Comment ajouter un client ?',
      a: 'Dans la section Clients, cliquez sur "+ Nouveau client". Entrez son nom, email et téléphone.',
      open: false
    },
    {
      q: 'Comment gérer les prestations ?',
      a: 'Les prestations sont liées à vos projets. Ouvrez un projet pour voir et ajouter les prestations associées.',
      open: false
    },
    {
      q: 'Mon mot de passe est perdu, que faire ?',
      a: 'La réinitialisation de mot de passe sera disponible prochainement. Pour l\'instant contactez un administrateur.',
      open: false
    }
  ];

  // ressources utiles pour les freelances
  ressources = [
    { label: 'URSSAF Auto-entrepreneur', url: 'https://www.urssaf.fr/accueil/outils-et-services/services-en-ligne/auto-entrepreneur.html', icon: '🏛️' },
    { label: 'AFDAS (formation freelance)', url: 'https://www.afdas.com/', icon: '🎓' },
    { label: 'Legifrance – droit du travail', url: 'https://www.legifrance.gouv.fr/', icon: '⚖️' },
    { label: 'Portail auto-entrepreneur', url: 'https://www.autoentrepreneur.urssaf.fr/', icon: '💼' }
  ];

  constructor(private router: Router) {}

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
  }

  get initials(): string {
    return this.username ? this.username.slice(0, 2).toUpperCase() : 'FH';
  }

  toggle(faq: any) {
    faq.open = !faq.open;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
