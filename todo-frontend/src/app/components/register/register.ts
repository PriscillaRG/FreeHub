import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: true,
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class RegisterComponent {

  // etapes : 'choice' = methode | 'form' = formulaire complet
  step: 'choice' | 'form' = 'choice';

  // champs du formulaire
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  dateOfBirth: string = '';
  password: string = '';
  newsletterOptIn: boolean = false;
  cgAccepted: boolean = false;

  message: string = '';
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
  socialRegister(provider: string) {
    this.error = `Inscription ${provider} disponible prochainement.`;
  }

  register() {
    // validations basiques
    if (!this.firstName || !this.lastName || !this.username || !this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    if (!this.cgAccepted) {
      this.error = 'Vous devez accepter les conditions d\'utilisation.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    this.loading = true;
    this.error = '';

    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password,
      dateOfBirth: this.dateOfBirth,
      newsletterOptIn: this.newsletterOptIn,
      cgAccepted: this.cgAccepted
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.message = 'Compte créé avec succès !';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Erreur lors de la création du compte. Vérifiez vos informations.';
        this.loading = false;
      }
    });
  }
}
