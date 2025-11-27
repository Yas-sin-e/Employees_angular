import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  users: User[] = [{ "username": "admin", "password": "123", "roles": ['ADMIN'] },// un tableau d'objets JSON
  { "username": "yassine", "password": "123", "roles": ['USER'] }];
  public loggedUser!: string;// le nom de l'utilisateur connecté
  public isloggedIn: Boolean = false; // c'est true si l'utilisateur est connecté
  public roles!: string[];// le role soit 'ADMIN' soit 'USER'

  constructor(private router: Router) { }
  logout() {
    this.isloggedIn = false;
    this.loggedUser = undefined!;
    this.roles = undefined!;
    localStorage.removeItem('loggedUser');
    localStorage.setItem('isloggedIn', String(this.isloggedIn));
    this.router.navigate(['/login']);
  }

  SignIn(user: User): Boolean {
    let validUser: Boolean = false;
    this.users.forEach((curUser) => {
      if (user.username == curUser.username && user.password == curUser.password) {
        validUser = true;
        this.loggedUser = curUser.username;
        this.isloggedIn = true;
        this.roles = curUser.roles;
        localStorage.setItem('loggedUser', this.loggedUser);
        localStorage.setItem('isloggedIn', String(this.isloggedIn));// localStorage ne stocke que des chaines de caracteres
      }
    });

    return validUser;
  }
  setLoggedUserFromLocalStorage(login: string) {
    this.loggedUser = login;
    this.isloggedIn = true;
    this.getUserRoles(login);
  }

  getUserRoles(username: string) {
    this.users.forEach((curUser) => {
      if (curUser.username == username) {
        this.roles = curUser.roles;
      }
    });

  }
  isAdmin(): Boolean {
    if (!this.roles) //this.roles== undefiened
      return false;
    return (this.roles.indexOf('ADMIN') > -1);// roles contient 'ADMIN'
  }
}
