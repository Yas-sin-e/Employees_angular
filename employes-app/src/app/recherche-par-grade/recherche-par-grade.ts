import { Component } from '@angular/core';
import { Employees } from '../model/employees.model';
import { DatePipe } from '@angular/common';
import { EmpServices } from '../services/emp-services';
import { RouterLink } from '@angular/router';
import { Grade } from '../model/Grade.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-recherche-par-grade',
  imports: [DatePipe,RouterLink,FormsModule],
  templateUrl: './recherche-par-grade.html',
  styles: ``
})
export class RechercheParGrade {
  employes : Employees[];
  grades! :Grade[];
  IdGrade! : number;

  constructor(private employeservice: EmpServices){
    this.grades=this.employeservice.listegrades();
    this.employes = [];
  }
  onChange(){
    console.log(this.IdGrade)
    this.employes=this.employeservice.rechercherParGrade(this.IdGrade)
  }

    supprimerEmploye(emp: Employees)
{
//console.log(emp);
let conf = confirm("Etes-vous sûr ?");
if (conf) {
  this.employeservice.deleteEmp(emp);
  this.employes=this.employeservice.rechercherParGrade(this.IdGrade);
}
}
}
