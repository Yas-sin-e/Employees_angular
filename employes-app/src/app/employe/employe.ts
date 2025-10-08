import { Component } from '@angular/core';
import { Employees } from '../model/employees.model';
import { DatePipe } from '@angular/common';
import { EmpServices } from '../services/emp-services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employe',
  imports: [DatePipe,RouterLink],
  templateUrl: './employe.html',
})
export class Employe {
  employes : Employees[]
  constructor(private employeservice: EmpServices){
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

