import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employees } from '../model/employees.model';
import { EmpServices } from '../services/emp-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from '../model/categorie.model';

@Component({
  selector: 'app-add-employe',
  imports:  [FormsModule],
  templateUrl: './add-employe.html',
})
export class AddEmploye {

  categories! : Categorie[];
  newIdCat! : number;
  newCategorie! : Categorie;


  newEmploye = new Employees();
constructor(private employeService: EmpServices,
            private router :Router,
            private activatedRoute: ActivatedRoute
            ) { }
 ngOnInit() {
    this.categories = this.employeService.listeCategories();
  }
  addEmploye(){
    this.newCategorie=this.employeService.consulterCategorie(this.newIdCat);
    this.newEmploye.categorie=this.newCategorie;
    this.employeService.ajouteremp(this.newEmploye);
    this.router.navigate(['employe'])
  }


}
