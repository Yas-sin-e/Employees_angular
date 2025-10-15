import { Injectable } from '@angular/core';
import { Employees } from '../model/employees.model';
import { Categorie } from '../model/categorie.model';

@Injectable({
  providedIn: 'root'
})
export class EmpServices {
  employes: Employees[];
  employe !:Employees;
  categories : Categorie[];

  constructor() {


    this.categories=[
      { idCatEmp: 1, nomCatEmp: "Développeur Web",niveau:"Junior"  },
      { idCatEmp: 2, nomCatEmp: "Chef d'équipe",niveau:"Senior"  },
      { idCatEmp: 3, nomCatEmp: "Directeur Technique", niveau:"Expert"}
    ];


    this.employes = [
      {
        idEmploye: 1,
        nomEmploye: 'Ben Salah',
        prenomEmploye: 'Ali',
        posteEmploye: 'Développeur',
        dateEmbauche: new Date('2021-04-12'),
        salaire: 1500,
        email: 'ali.bensalah@example.com',
        telephone: '22223333',
        adresse: 'Tunis',
        categorie:{ idCatEmp: 1, nomCatEmp: "Développeur Web",niveau:"Junior" },
        showDetails: false
      },
      {
        idEmploye: 2,
        nomEmploye: 'Gharbi',
        prenomEmploye: 'Sarra',
        posteEmploye: 'Designer',
        dateEmbauche: new Date('2022-01-08'),
        salaire: 1300,
        email: 'sarra.gharbi@example.com',
        telephone: '55446677',
        adresse: 'Nabeul',
        categorie: this.categories[1],
        showDetails: false
      },
      {
        idEmploye: 3,
        nomEmploye: 'Trabelsi',
        prenomEmploye: 'Khaled',
        posteEmploye: 'Chef de projet',
        dateEmbauche: new Date('2019-09-22'),
        salaire: 2200,
        email: 'khaled.trabelsi@example.com',
        telephone: '99887766',
        adresse: 'Sousse',
        categorie:this.categories[2],
        showDetails: false
      }

    ];
  }
  listeemp(): Employees[] {
    return this.employes;
  }
  ajouteremp(emp: Employees) {
    this.employes.push(emp);
  }
  deleteEmp(emp :Employees){

    const index = this.employes.indexOf(emp, 0);
       if (index > -1) {
         this.employes.splice(index, 1);
       }
 }
 consulterEmp(id:number): Employees{
this.employe =  this.employes.find(p => p.idEmploye == id)!;
return this.employe;
}
updateEmploye( emp: Employees){
    //chercher le employer dans le tab employees
   const index = this.employes.indexOf(emp, 0);
    if (index > -1) {
      this.employes.splice(index, 1); //supprimer l'ancien éléments
      this.employes.splice(index,0,emp); // insérer le nouvel élément    }
         }
}
listeCategories():Categorie[] {
      return this.categories;
    }
consulterCategorie(id:number): Categorie{
      return this.categories.find(cat => cat.idCatEmp  == id)!;
        }
}
