import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { Auth } from '../services/auth';
@Component({
  selector: 'app-verif-email',
  imports: [FormsModule, CommonModule],
  templateUrl: './verif-email.html',
  styleUrl: './verif-email.css'
})
export class VerifEmail {
code: string = '';
  user: User = new User();
  err: string = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) {}
   ngOnInit(): void {
    // Récupérer l'utilisateur qui vient de s'inscrire
    this.user = this.authService.getRegisteredUser();
  }
   onValidateEmail() {
    this.authService.validateEmail(this.code).subscribe({
      next: (res) => {
        alert('Email validé avec succès !');
        // Connecter automatiquement l'utilisateur après validation
        this.authService.login(this.user).subscribe({
          next: (data: any) => {
            let jwToken = data.headers.get('Authorization')!;
            this.authService.saveToken(jwToken);
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            console.log(err);
            this.router.navigate(['/login']); // rediriger vers login si auto-login échoue
          }
        });
      },
      error: (err: any) => {
        // Gestion des erreurs spécifiques
        if (err.error?.errorCode === 'INVALID_TOKEN') {
          this.err = 'Code invalide !';
        } else if (err.error?.errorCode === 'EXPIRED_TOKEN') {
          this.err = 'Code expiré !';
        } else {
          this.err = err.error?.message || 'Erreur de validation';
        }
      }
    });
  }
}
