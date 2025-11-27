import { Component } from '@angular/core';
import { Employees } from '../model/employees.model';
import { Grade } from '../model/Grade.model';
import { EmpServices } from '../services/emp-services';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-recherche-par-grade',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './recherche-par-grade.html',
})
export class RechercheParGrade {

  employes: Employees[] = [];
  grades!: Grade[];
  IdGrade!: number;

  constructor(private employeservice: EmpServices,public authService: Auth) {}

  ngOnInit() {
    this.employeservice.listegrades().subscribe(g => this.grades = g);
  }

  onChange() {
    this.employeservice.rechercherParGrade(this.IdGrade)
      .subscribe(emp => this.employes = emp);
  }

  supprimerEmploye(emp: Employees) {
    if (confirm("Etes-vous sûr ?") && emp.idEmploye) {
      this.employeservice.supprimerEmp(emp.idEmploye).subscribe(() => {
        this.onChange();
      });
    }
  }
}
