import { Routes } from '@angular/router';
import { Employe } from './employe/employe';
import { AddEmploye } from './add-employe/add-employe';
import { UpdateEmploye } from './update-employe/update-employe';
import { RechercheParGrade } from './recherche-par-grade/recherche-par-grade';
import { RechercheParNom } from './recherche-par-nom/recherche-par-nom';

export const routes: Routes = [
  {path: "employe", component : Employe},
  {path: "add_employe", component :AddEmploye},
  {path: "",redirectTo: "employe", pathMatch: "full" },
  {path: "updateEmploye/:id",  component: UpdateEmploye},
  {path: "rechercheParGrade", component : RechercheParGrade},
   {path: "rechercheParNom", component : RechercheParNom},
];
