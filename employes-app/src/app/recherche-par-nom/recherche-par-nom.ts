import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';  // <-- ajouter CommonModule
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmpServices } from '../services/emp-services';
import { Employees } from '../model/employees.model';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-recherche-par-nom',
  standalone: true,   // <-- important si composant standalone
  imports: [CommonModule, FormsModule, RouterLink, DatePipe], // <-- ajouter CommonModule
  templateUrl: './recherche-par-nom.html',
})
export class RechercheParNom implements OnInit {

  employes: Employees[] = [];
  searchTerm: string = '';

  constructor(private employeservice: EmpServices,public authService: Auth) {}

  ngOnInit(): void {
    // Charger tous les employés depuis le backend
    this.employeservice.listerEmp().subscribe(data => {
      this.employes = data;
    });
  }

  // Recherche dynamique et simplifiée
  get filteredEmployes(): Employees[] {
    if (!this.searchTerm) return this.employes;
    const term = this.searchTerm.toLowerCase().trim();
    return this.employes.filter(emp =>
      (emp.nomEmploye?.toLowerCase().includes(term)) ||
      (emp.prenomEmploye?.toLowerCase().includes(term))
    );
  }

  supprimerEmploye(emp: Employees) {
    if (confirm('Etes-vous sûr ?') && emp.idEmploye) {
      this.employeservice.supprimerEmp(emp.idEmploye).subscribe(() => {
        this.employes = this.employes.filter(e => e.idEmploye !== emp.idEmploye);
      });
    }
  }
}
