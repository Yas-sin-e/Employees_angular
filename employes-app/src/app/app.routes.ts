import { Routes } from '@angular/router';
import { Employe } from './employe/employe';
import { AddEmploye } from './add-employe/add-employe';
import { UpdateEmploye } from './update-employe/update-employe';
import { RechercheParGrade } from './recherche-par-grade/recherche-par-grade';
import { RechercheParNom } from './recherche-par-nom/recherche-par-nom';
import { Login } from './login/login';
import { Forbidden } from './forbidden/forbidden';
import { employeGuard } from './employe-guard';
import { authGuard } from './auth.guard'; // ← AJOUTER
import { ListeGrade } from './liste-grade/liste-grade';
import { Register } from './register/register';
import { VerifEmail } from './verif-email/verif-email';

export const routes: Routes = [
  // ← Pages publiques (sans guard)
  { path: 'login',           component: Login },
  { path: 'register',        component: Register },
  { path: 'verifEmail',      component: VerifEmail },
  { path: 'app-forbidden',   component: Forbidden },

  // ← Pages protégées : connecté requis
  { path: 'employe',         component: Employe,         canActivate: [authGuard] },
  { path: 'rechercheParGrade', component: RechercheParGrade, canActivate: [authGuard] },
  { path: 'rechercheParNom', component: RechercheParNom, canActivate: [authGuard] },

  // ← Pages protégées : ADMIN requis
  { path: 'add_employe',     component: AddEmploye,      canActivate: [employeGuard] },
  { path: 'updateEmploye/:id', component: UpdateEmploye, canActivate: [employeGuard] },
  { path: 'listeGrade',      component: ListeGrade,      canActivate: [employeGuard] },

  // ← Redirection par défaut
  { path: '', redirectTo: 'employe', pathMatch: 'full' },
];
