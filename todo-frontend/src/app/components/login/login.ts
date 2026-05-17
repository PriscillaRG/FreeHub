import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  // etape : 'choice' = choix methode | 'form' = formulaire email
  step: 'choice' | 'form' = 'choice';

  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  showForm() {
    this.step = 'form';
    this.error = '';
  }

  backToChoice() {
    this.step = 'choice';
    this.error = '';
  }

  // connexion Google / Apple (UI seulement - OAuth prevu en v2)
  socialLogin(provider: string) {
    this.error = `Connexion ${provider} disponible prochainement.`;
  }

  login() {
    if (!this.username || !this.password) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (token) => {
          this.authService.saveToken(token);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.error = 'Identifiants invalides. Vérifiez votre nom d\'utilisateur et mot de passe.';
          this.loading = false;
        }
      });
  }
}
