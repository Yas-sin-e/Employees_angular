import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';  // <-- ajouter CommonModule
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmpServices } from '../services/emp-services';
import { Employees } from '../model/employees.model';
import { Auth } from '../services/auth';
import { Image } from '../model/image.model';

@Component({
  selector: 'app-recherche-par-nom',
  standalone: true,   // <-- important si composant standalone
  imports: [CommonModule, FormsModule, RouterLink, DatePipe], // <-- ajouter CommonModule
  templateUrl: './recherche-par-nom.html',
})
export class RechercheParNom implements OnInit {

  employes: Employees[] = [];
  searchTerm: string = '';

  constructor(private employeservice: EmpServices, public authService: Auth) { }

  ngOnInit(): void {
    // Charger tous les employés depuis le backend
    this.employeservice.listerEmp().subscribe(data => {
      this.employes = data;
      // Charger l'image de chaque employé
      this.loadEmployeeImages();
    });
  }

  private loadEmployeeImages() {
    this.employes.forEach(emp => {
      if (emp.idEmploye) {
        this.employeservice.getImagesByEmp(emp.idEmploye).subscribe({
          next: (imgs: Image[]) => {
            if (imgs?.length) {
              emp.images = imgs;
              this.setImageStr(emp, imgs[0]);
            } else {
              this.loadFallbackImage(emp);
            }
          },
          error: () => this.loadFallbackImage(emp)
        });
      } else {
        this.loadFallbackImage(emp);
      }
    });
  }

  private loadFallbackImage(emp: Employees) {
    if (emp.images?.length) {
      this.setImageStr(emp, emp.images[0]);
    } else if (emp.image?.idImage) {
      this.employeservice.loadImage(emp.image.idImage).subscribe((img: Image) => {
        this.setImageStr(emp, img);
      });
    } else if (emp.imagePath && emp.idEmploye) {
      this.employeservice.getImageFS(emp.idEmploye).subscribe(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          emp.imageStr = reader.result as string;
        };
        reader.readAsDataURL(blob);
      });
    }
  }

  private setImageStr(emp: Employees, img: Image) {
    emp.imageStr = 'data:' + img.type + ';base64,' + img.image;
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
