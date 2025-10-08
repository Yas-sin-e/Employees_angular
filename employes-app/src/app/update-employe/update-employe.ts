import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employees } from '../model/employees.model';
import { EmpServices } from '../services/emp-services';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-update-employe',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-employe.html',
  styles: ``
})
export class UpdateEmploye  implements OnInit  {
   currentEmploye  = new Employees();
     constructor(private activatedRoute: ActivatedRoute,
              private EmployeServices: EmpServices,
              private router :Router,
            ) { }
ngOnInit() {

//  console.log(this.activatedRoute.snapshot.params['id']);
this.currentEmploye =
this.EmployeServices.consulterEmp(this.activatedRoute.snapshot.
params['id']);
   console.log(this.currentEmploye);
}
  updateEmploye()
  { //console.log(this.currentProduit);
    this.EmployeServices.updateEmploye(this.currentEmploye);
    this.router.navigate(['employe'])
  }
          }

