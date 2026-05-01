import { Component, OnInit } from '@angular/core';
import { Employees } from '../model/employees.model';
import { EmpServices } from '../services/emp-services';
import { Auth } from '../services/auth';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Image } from '../model/image.model'; // ← AJOUTER

@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [DatePipe, RouterLink, CommonModule],
  templateUrl: './employe.html',
})
export class Employe implements OnInit {

  employes!: Employees[];

  constructor(
    private employeservice: EmpServices,
    public authService: Auth
  ) { }

  ngOnInit(): void {
    this.recharger();
  }

  recharger() {
    this.employeservice.listerEmp().subscribe({
      next: (emps) => {
        this.employes = emps;
        this.employes.forEach(emp => this.loadPrimaryImage(emp));
      },
      error: (err) => console.error('Erreur chargement employés:', err)
    });
  }

  private loadPrimaryImage(emp: Employees) {
    if (emp.idEmploye) {
      this.employeservice.getImagesByEmp(emp.idEmploye).subscribe({
        next: (imgs: Image[]) => {
          if (imgs && imgs.length > 0) {
            emp.images = imgs;
            // Afficher SEULEMENT la première image (index 0)
            this.setImageStr(emp, imgs[0]);
          } else {
            this.loadFallbackImage(emp);
          }
        },
        error: () => this.loadFallbackImage(emp)
      });
      return;
    }

    this.loadFallbackImage(emp);
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

  supprimerEmploye(emp: Employees) {
    if (confirm("Etes-vous sûr ?") && emp.idEmploye) {
      this.employeservice.supprimerEmp(emp.idEmploye).subscribe(() => {
        this.recharger();
      });
    }
  }
}
