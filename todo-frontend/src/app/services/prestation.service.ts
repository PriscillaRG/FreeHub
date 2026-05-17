import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// interface Prestation -- doit coresponder aux champs de Prestation.java cote back
export interface Prestation {
  id?: number;
  title: string;           // nom de la prestation
  description?: string;
  type?: string;           // PHOTO | DESIGN | MUSIQUE | VIDEO | REDACTION | AUTRE
  status?: string;         // EN_ATTENTE | CONFIRME | EN_COURS | TERMINE | ANNULE
  price?: number;          // prix en euros (BigDecimal cote java)
  dueDate?: string;        // date limite (LocalDate cote java)
  client?: { id: number; name: string };  // client associe (objet simplifie)
}

// service pour les appels api liees aux prestations
@Injectable({
  providedIn: 'root'
})
export class PrestationService {

  private apiUrl = 'https://freehub-r2aw.onrender.com/api/prestations';

  constructor(private http: HttpClient) {}

  // recup toutes les prestations de l'utilisateur connecte
  getPrestations(): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(this.apiUrl);
  }

  // cree une prestation (le clientId est passe en query param si dispo)
  addPrestation(prestation: Prestation, clientId?: number): Observable<Prestation> {
    const params = clientId ? `?clientId=${clientId}` : '';
    return this.http.post<Prestation>(`${this.apiUrl}${params}`, prestation);
  }

  // modifie une prestation existante
  updatePrestation(id: number, prestation: Prestation): Observable<Prestation> {
    return this.http.put<Prestation>(`${this.apiUrl}/${id}`, prestation);
  }

  // met a jour seulement le statut (PATCH = modif partielle)
  updateStatus(id: number, status: string): Observable<Prestation> {
    return this.http.patch<Prestation>(`${this.apiUrl}/${id}/status`, { status });
  }

  // supprime une prestation
  deletePrestation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
