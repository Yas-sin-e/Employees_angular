import { Routes } from '@angular/router';
import { Employe } from './employe/employe';
import { AddEmploye } from './add-employe/add-employe';
import { UpdateEmploye } from './update-employe/update-employe';
import { RechercheParGrade } from './recherche-par-grade/recherche-par-grade';
import { RechercheParNom } from './recherche-par-nom/recherche-par-nom';
import { Login } from './login/login';
import { Forbidden } from './forbidden/forbidden';
import { employeGuard } from './employe-guard';
import { ListeGrade } from './liste-grade/liste-grade';


export const routes: Routes = [
  {path: "employe", component : Employe},
  {path: "add_employe", component :AddEmploye,canActivate:[employeGuard]},
  {path: "",redirectTo: "employe", pathMatch: "full" },
  {path: "updateEmploye/:id",  component: UpdateEmploye},
  {path: "rechercheParGrade", component : RechercheParGrade},
   {path: "rechercheParNom", component : RechercheParNom},
   {path:  'login', component: Login},
    {path:  'app-forbidden', component: Forbidden},
     {path: "listeGrade", component :ListeGrade, canActivate:[employeGuard]},
];
