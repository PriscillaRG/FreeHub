import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// guard qui protege les routes privees (dashboard, clients, etc.)
// Angular appelle canActivate() avant de charger la page
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();

    if (token) {
      // token present = utilisateur connecte, acces ok
      return true;
    }

    // pas de token = pas connecte, on redirige vers login
    this.router.navigate(['/login']);
    return false;
  }
}
