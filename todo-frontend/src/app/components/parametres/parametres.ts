import { Component, OnInit } from '@angular/core';
import { SidebarToggleComponent } from '../sidebar-toggle/sidebar-toggle';
import { BottomNavComponent } from '../bottom-nav/bottom-nav';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [ CommonModule, BottomNavComponent, SidebarToggleComponent, FormsModule, RouterModule],
  templateUrl: './parametres.html',
  styleUrls: ['./parametres.css']
})
export class ParametresComponent implements OnInit {

  username: string = '';
  sidebarOpen = true;

  role: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  dateOfBirth: string = '';
  mailAddress: string = '';

  // champs changement de mot de passe
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  pwdMessage = '';
  pwdError = false;
  showPwdForm = false;

  private jwtHelper = new JwtHelperService();

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.username = decoded?.sub || decoded?.username || '';
      this.role = decoded?.role || 'USER';
      this.firstName = decoded?.firstName || '';
      this.lastName = decoded?.lastName || '';
      this.email = decoded?.email || '';
      this.dateOfBirth = decoded?.dateOfBirth || '';
      this.mailAddress = `${this.username}@FreeHub.com`;
    }
  }

  get initials(): string {
    return this.username ? this.username.slice(0, 2).toUpperCase() : 'FH';
  }

  changePassword() {
    this.pwdMessage = '';
    this.pwdError = false;

    if (!this.oldPassword || !this.newPassword) {
      this.pwdMessage = 'Remplissez tous les champs.';
      this.pwdError = true;
      return;
    }
    if (this.newPassword.length < 6) {
      this.pwdMessage = 'Le nouveau mot de passe doit faire au moins 6 caractères.';
      this.pwdError = true;
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.pwdMessage = 'Les deux nouveaux mots de passe ne correspondent pas.';
      this.pwdError = true;
      return;
    }

    this.http.post('https://freehub-r2aw.onrender.com/api/auth/change-password',
      { oldPassword: this.oldPassword, newPassword: this.newPassword },
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.pwdMessage = '✅ Mot de passe mis à jour !';
        this.pwdError = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.pwdMessage = err.error || 'Ancien mot de passe incorrect.';
        this.pwdError = true;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
