import { Component } from '@angular/core';
import { Employees } from '../model/employees.model';
import { DatePipe } from '@angular/common';
import { EmpServices } from '../services/emp-services';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-employe',
  imports: [DatePipe,RouterLink],
  templateUrl: './employe.html',
})
export class Employe {
  employes : Employees[]
  constructor(private employeservice: EmpServices,public authService :Auth) {
    this.employes = employeservice.listeemp();

  }
  supprimerEmploye(emp: Employees)
{
//console.log(emp);
let conf = confirm("Etes-vous sûr ?");
if (conf) {

  this.employeservice.deleteEmp(emp);
}
}
  }

