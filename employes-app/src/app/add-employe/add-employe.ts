import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmpServices } from '../services/emp-services';
import { Router } from '@angular/router';
import { Grade } from '../model/Grade.model';
import { Employees } from '../model/employees.model';

@Component({
  selector: 'app-add-employe',
  templateUrl: './add-employe.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddEmploye {

  empForm!: FormGroup;
  grades: Grade[] = [];

  constructor(
    private fb: FormBuilder,
    private employeService: EmpServices,
    private router: Router,
  ) {}

  ngOnInit() {

    // Charger la liste des grades depuis l’API
    this.employeService.listegrades().subscribe({
      next: (g) => {
        this.grades = g;
        console.log("Grades chargés :", g);
      },
      error: (err) => console.error("Erreur chargement Grades:", err)
    });

    // Formulaire réactif
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

  addEmploye() {
    if (this.empForm.invalid) {
      this.empForm.markAllAsTouched();
      return;
    }

    const form = this.empForm.value;

    // Récupérer l'objet grade complet
    const selectedGrade = this.grades.find(g => g.idGraEmp == form.idGra);

    if (!selectedGrade) {
      console.error("Grade introuvable !");
      return;
    }

    const newEmployee: Employees = {
      nomEmploye: form.nomEmploye,
      prenomEmploye: form.prenomEmploye,
      posteEmploye: form.posteEmploye,
      dateEmbauche: form.dateEmbauche,
      salaire: form.salaire,
      email: form.email,
      telephone: form.telephone,
      adresse: form.adresse,
      grade: selectedGrade,
      showDetails: false
    };

    // Appel API
    this.employeService.ajouterEmp(newEmployee).subscribe({
      next: () => {
        console.log("Employé ajouté !");
        this.router.navigate(["/employe"]);
      },
      error: err => console.log("Erreur API:", err)
    });
  }
}
