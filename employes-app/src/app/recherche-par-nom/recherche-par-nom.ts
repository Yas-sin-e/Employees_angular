import {  DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmpServices } from '../services/emp-services';
import { Employees } from '../model/employees.model';
import { SearchFilterPipe } from '../search-filter-pipe';


@Component({
  selector: 'app-recherche-par-nom',
  imports: [DatePipe,RouterLink,FormsModule,SearchFilterPipe],
  templateUrl: './recherche-par-nom.html',
  styles: ``
})
export class RechercheParNom implements OnInit{
employes! : Employees[];
nomemp!: string;
 allEmp! : Employees[];
 searchTerm!: string;
//
constructor(private employeservice: EmpServices){
  // this.employes=[];
}


// ngOnInit(): void {
//   this.employes = this.employeservice.listeemp().map(emp => ({
//     ...emp,
//     n: emp.prenomEmploye // ou emp.nomEmploye selon ce que tu veux filtrer
//   }));
// }
ngOnInit(): void {
    // Charger tous les employés au démarrage
    this.allEmp = this.employeservice.listeemp();
    this.employes = [...this.allEmp]; // copie pour affichage initial
  }
onKeyUp(filterText: string) {
    if (!filterText.trim()) {
      // Si le champ est vide → réaffiche tout
      this.employes = [...this.allEmp];
      return;
    }

    // Sinon filtre en fonction du nom
    this.employes = this.allEmp.filter(item =>
      item.prenomEmploye!.toLowerCase().startsWith(filterText.toLowerCase())
    );
  }
rechercherEmp(){
  if (!this.nomemp || this.nomemp.trim() === '') {
    this.employes = this.employeservice.listeemp();;

  }else{
    this.employes= this.employeservice.rechercherParNom(this.nomemp);
  }
}

supprimerEmploye(emp: Employees){
//console.log(emp);
let conf = confirm("Etes-vous sûr ?");
if (conf) {

  this.employeservice.deleteEmp(emp);
   this.employes = this.employeservice.listeemp();

}
}

}
