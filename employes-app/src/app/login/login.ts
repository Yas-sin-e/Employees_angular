import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.html',
  styles: ``
})
export class Login {
  message: string = 'Login ou mot de passe erronés...';
  erreur: number = 0;

  user = new User();
  constructor(private authService: Auth, private router: Router) { }

  onLoggedin() {
  this.authService.login(this.user).subscribe({
    next: (data: any) => {
      let jwToken = data.headers.get('Authorization')!;
      this.authService.saveToken(jwToken);
      this.router.navigate(['/']);
    },
    error: (err) => {
      this.erreur = 1;
      if (err.error?.errorCause === 'disabled') {
        this.message = 'Utilisateur désactivé, veuillez contacter votre Administrateur';
      }
    }
  });
}}
