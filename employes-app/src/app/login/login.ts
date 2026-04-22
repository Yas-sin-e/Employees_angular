import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styles: ``
})
export class Login {
  erreur:boolean=false;

  user = new User();
  constructor(private authService: Auth, private router: Router) { }

  onLoggedin() {
    this.authService.login(this.user).subscribe({
    next: (data) => {
      let jwToken = data.headers.get('Authorization')!;
      this.authService.saveToken(jwToken);
      this.router.navigate(['/']); // Redirige vers la liste des employés
    },
    error: (err: any) => {
      this.erreur = true; // Affiche un message d'erreur dans le HTML
    }
  });
  }}
