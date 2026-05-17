import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarToggleComponent } from '../sidebar-toggle/sidebar-toggle';
import { BottomNavComponent } from '../bottom-nav/bottom-nav';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { ClientService } from '../../services/client.service';
import { FactureService } from '../../services/facture.service';
import { JwtHelperService } from '@auth0/angular-jwt';

declare const Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, BottomNavComponent, SidebarToggleComponent, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('revenueChart') chartRef!: ElementRef;

  username: string = '';
  sidebarOpen = true;
  role: string = '';

  // Stats
  clientCount: number = 0;
  factureCount: number = 0;
  totalCa: number = 0;
  totalARecevoir: number = 0;

  // Activites recentes (factures)
  recentActivities: any[] = [];

  // Todo urgents (calcules depuis les factures reelles)
  facturesBrouillon: number = 0;
  facturesEnRetard: number = 0;

  // Raccourcis
  shortcuts = [
    { label: 'Créer un devis', icon: '📄', route: '/factures' },
    { label: 'Nouvelle facture', icon: '🧾', route: '/factures' },
    { label: 'Aide & Ressources', icon: '💡', route: '/aide' },
    { label: 'Mes projets', icon: '📁', route: '/projets' }];

  // Donnees graphique mensuel (initialisees a 0, remplies depuis les factures)
  chartMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  chartValues: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // tendance CA : comparaison mois actuel vs mois precedent
  caTrendLabel: string = '';
  caTrendUp: boolean = true;

  private chartInstance: any = null;
  private jwtHelper = new JwtHelperService();

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private clientService: ClientService,
    private factureService: FactureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // decode le token pour le username et role
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.username = decoded?.sub || decoded?.username || 'Utilisateur';
      this.role = decoded?.role || 'USER';
    }

    // recup nb clients
    this.clientService.getClients().subscribe({
      next: clients => this.clientCount = clients.length,
      error: () => {}
    });

    // recup factures : CA, a recevoir, graphique, activites recentes
    this.factureService.getFactures().subscribe({
      next: (factures: any[]) => {
        this.factureCount = factures.length;

        // CA = somme des factures PAYEE
        this.totalCa = factures
          .filter(f => f.status === 'PAYEE')
          .reduce((acc: number, f: any) => acc + (f.montant || 0), 0);

        // a recevoir = ENVOYEE + EN_RETARD
        this.totalARecevoir = factures
          .filter(f => f.status === 'ENVOYEE' || f.status === 'EN_RETARD')
          .reduce((acc: number, f: any) => acc + (f.montant || 0), 0);

        // todo urgents
        this.facturesBrouillon = factures.filter(f => f.status === 'BROUILLON').length;
        this.facturesEnRetard = factures.filter(f => f.status === 'EN_RETARD').length;

        // graphique : CA mensuel depuis les factures PAYEE
        const values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        factures
          .filter(f => f.status === 'PAYEE' && f.dateEmission)
          .forEach(f => {
            const mois = new Date(f.dateEmission).getMonth();
            values[mois] += f.montant || 0;
          });
        this.chartValues = values;
        this.refreshChart();

        // calcul tendance : mois actuel vs mois precedent
        const moisActuel = new Date().getMonth();
        const moisPrec = moisActuel === 0 ? 11 : moisActuel - 1;
        const caActuel = values[moisActuel];
        const caPrec = values[moisPrec];
        if (caPrec === 0 && caActuel === 0) {
          this.caTrendLabel = 'aucune facture ce mois';
          this.caTrendUp = true;
        } else if (caPrec === 0) {
          this.caTrendLabel = '↑ premier mois';
          this.caTrendUp = true;
        } else {
          const pct = Math.round(((caActuel - caPrec) / caPrec) * 100);
          this.caTrendUp = pct >= 0;
          this.caTrendLabel = (pct >= 0 ? '↑ +' : '↓ ') + pct + '% vs mois dernier';
        }

        // activites recentes (5 dernieres factures)
        this.recentActivities = factures.slice(0, 5).map((f: any) => ({
          label: f.numero || 'Facture',
          sub: f.client?.nom || 'Client',
          amount: f.montant || 0,
          status: f.status || 'BROUILLON',
          date: f.dateEmission ? new Date(f.dateEmission).toLocaleDateString('fr-FR') : '—'
        }));
      },
      error: () => {}
    });
  }

  ngAfterViewInit(): void {
    // attendre que Chart.js et le DOM soient prets
    this.tryInitChart(0);
  }

  private tryInitChart(attempts: number): void {
    if (attempts > 10) return; // max 10 essais
    if (typeof Chart === 'undefined' || !this.chartRef?.nativeElement) {
      setTimeout(() => this.tryInitChart(attempts + 1), 200);
      return;
    }
    this.initChart();
  }

  private initChart(): void {
    if (!this.chartRef?.nativeElement) return;
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    // detruire l'instance precedente si elle existe
    if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }

    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(167, 139, 198, 0.35)');
    gradient.addColorStop(1, 'rgba(167, 139, 198, 0.02)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartMonths,
        datasets: [{
          label: 'Chiffre d\'affaires (€)',
          data: this.chartValues,
          borderColor: '#A78BC6',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.45,
          pointBackgroundColor: '#A78BC6',
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#2B2D31',
            bodyColor: '#9B9599',
            borderColor: '#E3D6C8',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (ctx: any) => ` ${ctx.parsed.y.toLocaleString('fr-FR')} €`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#9B9599', font: { family: 'Montserrat', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(227,214,200,0.5)', drawTicks: false },
            border: { dash: [4, 4] },
            ticks: {
              color: '#9B9599',
              font: { family: 'Montserrat', size: 11 },
              callback: (v: any) => v > 0 ? v / 1000 + 'k€' : '0'
            }
          }
        }
      }
    });
  }

  private refreshChart(): void {
    if (this.chartInstance) {
      this.chartInstance.data.datasets[0].data = [...this.chartValues];
      this.chartInstance.update();
    }
  }

  get initials(): string {
    return this.username ? this.username.slice(0, 2).toUpperCase() : 'FH';
  }

  get greetingEmoji(): string {
    const h = new Date().getHours();
    if (h < 12) return '☀️';
    if (h < 18) return '🌤️';
    return '🌙';
  }

  get caFormatted(): string {
    return this.totalCa.toLocaleString('fr-FR') + ' €';
  }

  get aRecevoirFormatted(): string {
    return this.totalARecevoir.toLocaleString('fr-FR') + ' €';
  }

  statusLabel(s: string): string {
    const m: Record<string, string> = {
      PAYEE: 'Payée', ENVOYEE: 'Envoyée', BROUILLON: 'Brouillon',
      EN_RETARD: 'En retard', ANNULEE: 'Annulée'
    };
    return m[s] || s;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
