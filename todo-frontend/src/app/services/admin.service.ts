import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// service admin -- accessible uniquement pour le role ADMIN
// les endpoints backend verifient aussi le role donc c'est secure
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'https://freehub-r2aw.onrender.com/api/admin';

  constructor(private http: HttpClient) {}

  // recup tous les utilisateurs (admin only)
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  // recup les taches d'un utilisateur specifique
  getUserTasks(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${username}/tasks`);
  }

  // cree un nouvel utilisateur avec un role (USER ou ADMIN)
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }
}
