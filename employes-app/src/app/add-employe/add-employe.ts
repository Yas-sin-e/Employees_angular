import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmpServices } from '../services/emp-services';
import { Router } from '@angular/router';
import { Grade } from '../model/Grade.model';
import { Employees } from '../model/employees.model';
import { Image } from '../model/image.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-employe',
  standalone: true,
  templateUrl: './add-employe.html',
  styleUrls: ['./add-employe.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddEmploye implements OnInit {

  empForm!: FormGroup;
  grades: Grade[] = [];
  uploadedImages: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private fb: FormBuilder,
    private employeService: EmpServices,
    private router: Router,
  ) { }

  ngOnInit() {
    this.employeService.listegrades().subscribe({
      next: (g) => {
        this.grades = g;
        console.log("Grades chargés :", g);
      },
      error: (err) => console.error("Erreur chargement Grades:", err)
    });

    this.empForm = this.fb.group({
      idEmploye: [''],
      nomEmploye: ['', [Validators.required, Validators.minLength(3)]],
      prenomEmploye: ['', Validators.required],
      posteEmploye: ['', Validators.required],
      dateEmbauche: ['', Validators.required],
      salaire: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      adresse: ['', Validators.required],
      idGra: ['', Validators.required],
    });
  }

  // Convert string "yyyy-MM-dd" to Date object
  private convertToDate(dateString: string): Date | undefined {
    if (!dateString) return undefined;
    const parts = dateString.split('-');
    if (parts.length !== 3) return undefined;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  onImageUpload(event: any) {
    const files = event.target.files;
    this.uploadedImages = [];
    this.imagePreviews = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadedImages.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  triggerFileInput() {
    const fileInput = document.getElementById('imagesInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  addEmploye() {
    if (this.empForm.invalid) {
      this.empForm.markAllAsTouched();
      return;
    }

    const form = this.empForm.value;
    const selectedGrade = this.grades.find(g => g.idGraEmp == form.idGra);

    if (!selectedGrade) {
      console.error("Grade introuvable !");
      return;
    }

    const newEmployee: Employees = {
      nomEmploye: form.nomEmploye,
      prenomEmploye: form.prenomEmploye,
      posteEmploye: form.posteEmploye,
      dateEmbauche: this.convertToDate(form.dateEmbauche),
      salaire: form.salaire,
      email: form.email,
      telephone: form.telephone,
      adresse: form.adresse,
      grade: selectedGrade,
      showDetails: false,
      imageStr: '',
      images: []
    };

    this.employeService.ajouterEmp(newEmployee).subscribe({
      next: (savedEmployee) => {
        const idEmp = savedEmployee.idEmploye;
        if (!idEmp || this.uploadedImages.length === 0) {
          console.log("Employé ajouté sans image !");
          this.router.navigate(["/employe"]);
          return;
        }

        const uploads = this.uploadedImages.map(file =>
          this.employeService.uploadImageProd(file, file.name, idEmp)
        );

        forkJoin(uploads).subscribe({
          next: (imgs: Image[]) => {
            console.log("Employé ajouté avec " + imgs.length + " image(s) !");
            this.router.navigate(["/employe"]);
          },
          error: err => console.error("Erreur upload images employé:", err)
        });
      },
      error: err => console.error("Erreur ajout employé:", err)
    });
  }
}
