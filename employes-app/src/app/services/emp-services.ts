import { Injectable } from '@angular/core';
import { Employees } from '../model/employees.model';
import { Grade } from '../model/Grade.model';
import { Employe } from '../employe/employe';

@Injectable({
  providedIn: 'root'
})
export class EmpServices {
  employes: Employees[];
  employe !: Employees;
  grades: Grade[];
  EmpRecherche! : Employees[];

  constructor() {


    this.grades = [
      { idGraEmp: 1, nomGraEmp: "Développeur Web", niveau: "Junior" },
      { idGraEmp: 2, nomGraEmp: "Chef d'équipe", niveau: "Senior" },
      { idGraEmp: 3, nomGraEmp: "Directeur Technique", niveau: "Expert" }
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
        grade: { idGraEmp: 1, nomGraEmp: "Développeur Web", niveau: "Junior" },
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
        grade: this.grades[1],
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
        grade: this.grades[2],
        showDetails: false
      }

    ];
  }
  idExiste(id: number): boolean {
    return this.employes.some((e) => e.idEmploye === id);
  }
  listeemp(): Employees[] {
    return this.employes;
  }
  ajouteremp(emp: Employees) {
    this.employes.push(emp);
  }
  deleteEmp(emp: Employees) {

    const index = this.employes.indexOf(emp, 0);
    if (index > -1) {
      this.employes.splice(index, 1);
    }
  }
  consulterEmp(id: number): Employees {
    this.employe = this.employes.find(p => p.idEmploye == id)!;
    return this.employe;
  }
  updateEmploye(updatedEmp: Employees) {
    const index = this.employes.findIndex(emp => emp.idEmploye === updatedEmp.idEmploye);
    if (index !== -1) {
      this.employes[index] = updatedEmp; // 🔑 remplacer l'objet existant
    }
  }
  listegrades(): Grade[] {
    return this.grades;
  }
  ajoutergrade(gra: Grade) {
    this.grades.push(gra);
  }
  updateGrade(gra: Grade) {
    const index = this.grades.findIndex(c => c.idGraEmp === gra.idGraEmp);
    if (index !== -1) {
      this.grades[index] = gra;
    }
  }



  consulterGrade(id: number): Grade {
    return this.grades.find(cat => cat.idGraEmp == id)!;
  }

  rechercherParGrade(idGra: number): Employees[] {
    this.EmpRecherche = [];
    this.employes.forEach((cur, index) => {
        if(idGra == cur.grade.idGraEmp) {
            console.log("cur "+cur);
            this.EmpRecherche.push(cur);
        }
    });

    return this.EmpRecherche;
}
rechercherParNom(nom: string): Employees[] {
  return this.employes.filter(e =>
    e.prenomEmploye!.toLowerCase().startsWith(nom.toLowerCase())
  );
}
}
