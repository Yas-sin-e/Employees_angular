import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employees } from '../model/employees.model';
import { EmpServices } from '../services/emp-services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-employe',
  imports:  [FormsModule],
  templateUrl: './add-employe.html',
})
export class AddEmploye {
  newEmploye = new Employees();
constructor(private employeService: EmpServices,
            private router :Router,
            private activatedRoute: ActivatedRoute
            ) { }

  addEmploye(){
    //console.log(this.newEmploye);
    this.employeService.ajouteremp(this.newEmploye);
    this.router.navigate(['employe'])
  }
 

}
