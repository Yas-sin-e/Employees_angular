import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements  OnInit {
  protected readonly title = signal('employes-app');
  constructor (public authService: Auth, private router: Router) {}
  onLogout(){
  this.authService.logout();
  }

  ngOnInit () {
this.authService.loadToken();
if (this.authService.getToken()==null ||
this.authService.isTokenExpired())
this.router.navigate(['/login']);
}
}
