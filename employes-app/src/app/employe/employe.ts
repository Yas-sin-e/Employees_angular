import { Component, OnInit } from '@angular/core';
import { Employees } from '../model/employees.model';
import { EmpServices } from '../services/emp-services';
import { Auth } from '../services/auth';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-employe',
  imports: [DatePipe, RouterLink,CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employe.html',
})
export class Employe implements OnInit {
  employes!: Employees[];

  constructor(
    private employeservice: EmpServices,
    public authService: Auth
  ) {}

  ngOnInit(): void {
    this.recharger();
  }

  recharger() {
    this.employeservice.listerEmp().subscribe(emp => {
      this.employes = emp;
    });
  }

  supprimerEmploye(emp: Employees) {
    if (confirm("Etes-vous sûr ?") && emp.idEmploye) {
      this.employeservice.supprimerEmp(emp.idEmploye).subscribe(() => {
        this.recharger();
      });
    }
  }
}
