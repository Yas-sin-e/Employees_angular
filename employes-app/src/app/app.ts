import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('employes-app');

  constructor(public authService: Auth, private router: Router) {}

  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.authService.loadToken();

    // ← Pages publiques à exclure de la redirection
    const publicPages = ['/login', '/register', '/verifEmail'];
    const currentUrl = window.location.pathname;
    const isPublicPage = publicPages.some(page => currentUrl.includes(page));

    if (!isPublicPage) {
      // ← Seulement vérifier le token sur les pages protégées
      if (this.authService.getToken() == null || this.authService.isTokenExpired()) {
        this.router.navigate(['/login']);
      }
    }
  }
}
