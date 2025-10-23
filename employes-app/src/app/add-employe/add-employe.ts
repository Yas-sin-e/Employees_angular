import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employees } from '../model/employees.model';
import { EmpServices } from '../services/emp-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Grade } from '../model/Grade.model';

@Component({
  selector: 'app-add-employe',
  imports: [FormsModule],
  templateUrl: './add-employe.html',
})
export class AddEmploye {

  grades!: Grade[];
  newIdGra!: number;
  newgrades!: Grade;


  newEmploye = new Employees();
  constructor(private employeService: EmpServices,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit() {
    this.grades = this.employeService.listegrades();
  }
  addEmploye() {
    this.newgrades = this.employeService.consulterGrade(this.newIdGra);
    this.newEmploye.grade = this.newgrades;
    this.employeService.ajouteremp(this.newEmploye);
    this.router.navigate(['employe'])
  }


}
