import { Component, OnInit } from '@angular/core';
import { Grade } from '../model/Grade.model';
import { EmpServices } from '../services/emp-services';
import { UpdateGrade } from '../update-grade/update-grade';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-liste-grade',
  imports: [UpdateGrade,CommonModule],
  templateUrl: './liste-grade.html',
  styles: ``
})
export class ListeGrade implements OnInit  {
  grades! : Grade[];
  updategrade:Grade = {"idGraEmp":null,"nomGraEmp":"","niveau":""};
  ajout:boolean=true;
  constructor(private  employeservice: EmpServices) {}
  ngOnInit(): void {
    this.chargergrades();
  }
  chargergrades(){
  this.grades = this.employeservice.listegrades();
  }
  gradeUpdated(gra: Grade){
     if (this.ajout)
      this.employeservice.ajoutergrade(gra);
    else
      this.employeservice.updateGrade(gra);

    this.chargergrades();
    this.ajout = true;
    this.updategrade = { idGraEmp: null, nomGraEmp: "", niveau: "" };
  }
  update_grade(gra: Grade){
    this.updategrade = gra;
    this.ajout=false;
  }
}
