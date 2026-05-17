import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrestationService, Prestation } from '../../services/prestation.service';
import { ClientService, Client } from '../../services/client.service';

@Component({
  selector: 'app-prestations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './prestations.html',
  styleUrls: ['./prestations.css']
})
export class PrestationsComponent implements OnInit {

  prestations: Prestation[] = [];
  clients: Client[] = [];
  showForm = false;
  selectedPrestation: Prestation | null = null;

  newPrestation: Prestation = { title: '', type: 'AUTRE', status: 'EN_ATTENTE', price: 0 };
  selectedClientId?: number;

  constructor(
    private prestationService: PrestationService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.load();
    this.clientService.getClients().subscribe({ next: c => this.clients = c, error: () => {} });
  }

  load() {
    this.prestationService.getPrestations().subscribe({ next: p => this.prestations = p, error: () => {} });
  }

  add() {
    if (!this.newPrestation.title.trim()) return;
    this.prestationService.addPrestation(this.newPrestation, this.selectedClientId).subscribe(() => {
      this.newPrestation = { title: '', type: 'AUTRE', status: 'EN_ATTENTE', price: 0 };
      this.selectedClientId = undefined;
      this.showForm = false;
      this.load();
    });
  }

  changeStatus(id: number, status: string) {
    this.prestationService.updateStatus(id, status).subscribe(() => this.load());
  }

  delete(id: number) {
    this.prestationService.deletePrestation(id).subscribe(() => {
      if (this.selectedPrestation?.id === id) this.selectedPrestation = null;
      this.load();
    });
  }

  select(p: Prestation) {
    this.selectedPrestation = this.selectedPrestation?.id === p.id ? null : p;
  }

  get totalCa(): number {
    return this.prestations.reduce((acc, p) => acc + (p.price || 0), 0);
  }

  get activeCount(): number {
    return this.prestations.filter(p => p.status === 'EN_COURS' || p.status === 'CONFIRME').length;
  }
}
