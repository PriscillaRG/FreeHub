import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

// service d'authentification -- gere le login, register et le token JWT
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // url du backend (auth controller)
  private apiUrl = 'https://freehub-r2aw.onrender.com/api/auth';

  // utilitaire pour decoder le token sans avoir a le faire a la main
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // inscription d'un nouvel utilisateur
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // connexion -- le back renvoie le token en texte brut
  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user, { responseType: 'text' });
  }

  // sauvegarde le token dans le localStorage du navigateur
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // recupere le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // supprime le token = deconnexion
  logout(): void {
    localStorage.removeItem('token');
  }

  // lit le role depuis le token decode (USER ou ADMIN)
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.role || null;
  }
}
