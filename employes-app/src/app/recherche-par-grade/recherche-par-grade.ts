import { Component } from '@angular/core';
import { Employees } from '../model/employees.model';
import { Grade } from '../model/Grade.model';
import { EmpServices } from '../services/emp-services';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';
import { Image } from '../model/image.model';

@Component({
  selector: 'app-recherche-par-grade',
  imports: [FormsModule, DatePipe, RouterLink, CommonModule],
  templateUrl: './recherche-par-grade.html',
})
export class RechercheParGrade {

  employes: Employees[] = [];
  grades!: Grade[];
  IdGrade!: number;

  constructor(private employeservice: EmpServices, public authService: Auth) { }

  ngOnInit() {
    this.employeservice.listegrades().subscribe(g => this.grades = g);
  }

  onChange() {
    this.employeservice.rechercherParGrade(this.IdGrade)
      .subscribe(emp => {
        this.employes = emp;
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

  supprimerEmploye(emp: Employees) {
    if (confirm("Etes-vous sûr ?") && emp.idEmploye) {
      this.employeservice.supprimerEmp(emp.idEmploye).subscribe(() => {
        this.onChange();
      });
    }
  }
}
