import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employees } from '../model/employees.model';
import { EmpServices } from '../services/emp-services';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { Grade } from '../model/Grade.model';

@Component({
  selector: 'app-update-employe',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-employe.html',
  styles: ``
})
export class UpdateEmploye implements OnInit {
  grades!: Grade[];
  updatedCatId!: number;

  currentEmploye = new Employees();
  constructor(private activatedRoute: ActivatedRoute,
    private EmployeServices: EmpServices,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.grades = this.EmployeServices.listegrades();

    this.currentEmploye =
      this.EmployeServices.consulterEmp(this.activatedRoute.snapshot.
        params['id']);
    this.updatedCatId = this.currentEmploye.grade.idGraEmp;
    //console.log(this.currentEmploye);
  }
  updateEmploye() {
    this.currentEmploye.grade = this.EmployeServices.consulterGrade(this.updatedCatId)
    this.EmployeServices.updateEmploye(this.currentEmploye);
    this.router.navigate(['employe'])
  }

}

