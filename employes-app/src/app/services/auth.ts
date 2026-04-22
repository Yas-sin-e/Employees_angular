import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // users: User[] = [{ "username": "admin", "password": "123", "roles": ['ADMIN'] },// un tableau d'objets JSON
  // { "username": "yassine", "password": "123", "roles": ['USER'] }];
  apiUserURL: string = 'http://localhost:8082/users';
  token!: string | null;
  private helper = new JwtHelperService();

  public loggedUser!: string;// le nom de l'utilisateur connecté
  public isloggedIn: Boolean = false; // c'est true si l'utilisateur est connecté
  public roles!: string[];// le role soit 'ADMIN' soit 'USER'

  constructor(private router: Router, private http: HttpClient) { }
  login(user: any) {
    return this.http.post(this.apiUserURL + '/login', user, { observe: 'response' });
  }

  saveToken(jwt: string) {
    localStorage.setItem('jwt', jwt);
    this.token = jwt;
    this.isloggedIn = true;
    this.decodeJWT();
  }
  decodeJWT() {
    if (this.token == undefined) return;
    const decodedToken = this.helper.decodeToken(this.token);
    this.roles = decodedToken.roles;
    this.loggedUser = decodedToken.sub;
  }
  loadToken() {
    this.token = localStorage.getItem('jwt');
    this.decodeJWT();
  }
  logout() {
    this.loggedUser = undefined!;
    this.roles = undefined!;
    this.token = undefined!;
    this.isloggedIn = false;
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  getToken():string | null {
    return this.token;
  }



  setLoggedUserFromLocalStorage(login: string) {
    this.loggedUser = login;
    this.isloggedIn = true;
   //this.decodeJWT(login);
  }


 isTokenExpired(): Boolean {
    return this.helper.isTokenExpired(this.token!);
  }
  isAdmin(): Boolean {
    if (!this.roles) //this.roles== undefiened
      return false;
    return (this.roles.indexOf('ADMIN') > -1);// roles contient 'ADMIN'
  }
}
