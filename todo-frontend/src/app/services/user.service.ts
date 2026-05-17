import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// service utilisateur -- pour les operations liees au compte
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://freehub-r2aw.onrender.com/api/auth/users';

  constructor(private http: HttpClient) {}

  // recup la liste de tous les utilisateurs
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
