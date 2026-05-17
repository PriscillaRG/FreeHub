import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// interface Client -- doit correspondre aux champs du Client.java cote backend
export interface Client {
  id?: number;
  name: string;
  email: string;
  phone: string;
  company?: string;   // nom de l'entreprise (optionel)
  notes?: string;     // notes libres sur le client
}

// service pour toutes les requetes liees aux clients
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // url de base de l'api clients
  private apiUrl = 'https://freehub-r2aw.onrender.com/api/clients';

  constructor(private http: HttpClient) {}

  // recup tous les clients de l'utilisateur connecte
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // cree un nouveau client
  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  // modifie un client existant (PUT = remplacement complet)
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  // supprime un client par son id
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
