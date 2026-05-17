import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Facture {
  id?: number;
  numero?: string;
  status?: string;
  montant?: number;
  tva?: number;
  dateEmission?: string;
  dateEcheance?: string;
  description?: string;
  client?: { id: number; name: string; email?: string; company?: string };
  projet?: { id: number; titre: string };
}

@Injectable({ providedIn: 'root' })
export class FactureService {

  private baseUrl = 'https://freehub-r2aw.onrender.com/api/factures';

  constructor(private http: HttpClient) {}

  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.baseUrl);
  }

  createFacture(facture: Facture, clientId?: number, projetId?: number): Observable<Facture> {
    let params = '';
    if (clientId) params += `?clientId=${clientId}`;
    if (projetId) params += (params ? '&' : '?') + `projetId=${projetId}`;
    return this.http.post<Facture>(`${this.baseUrl}${params}`, facture);
  }

  updateStatus(id: number, status: string): Observable<Facture> {
    return this.http.patch<Facture>(`${this.baseUrl}/${id}/status`, { status });
  }

  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
