import { Injectable } from '@angular/core';
import { Employees } from '../model/employees.model';

@Injectable({
  providedIn: 'root'
})
export class EmpServices {
  employes: Employees[];
  employe !:Employees;
  constructor() {
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
        adresse: 'Tunis'
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
        adresse: 'Nabeul'
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
        adresse: 'Sousse'
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

}
