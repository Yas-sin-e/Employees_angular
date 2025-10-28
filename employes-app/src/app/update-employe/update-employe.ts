import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpServices } from '../services/emp-services';
import { Grade } from '../model/Grade.model';
import { Employees } from '../model/employees.model';

@Component({
  selector: 'app-update-employe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-employe.html'
})
export class UpdateEmploye {
  editForm!: FormGroup;
  grades!: Grade[];
  currentEmploye!: Employees;

  constructor(
    private fb: FormBuilder,
    private employeService: EmpServices,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.currentEmploye = this.employeService.consulterEmp(id); // récupérer l'employé
    this.grades = this.employeService.listegrades();

    // Création du formulaire avec validations
    this.editForm = this.fb.group({
      idEmploye: [this.currentEmploye.idEmploye, Validators.required],
      nomEmploye: [this.currentEmploye.nomEmploye, [Validators.required, Validators.minLength(3)]],
      prenomEmploye: [this.currentEmploye.prenomEmploye, Validators.required],
      posteEmploye: [this.currentEmploye.posteEmploye, Validators.required],
      dateEmbauche: [this.currentEmploye.dateEmbauche, Validators.required],
      salaire: [this.currentEmploye.salaire, [Validators.required, Validators.min(1)]],
      email: [this.currentEmploye.email, [Validators.required, Validators.email]],
      telephone: [this.currentEmploye.telephone, [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      adresse: [this.currentEmploye.adresse, Validators.required],
      idGra: [this.currentEmploye.grade.idGraEmp, Validators.required]
    });
  }

  updateEmploye() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValues = this.editForm.value;

    // Préparer l'objet employé mis à jour
    const updatedEmploye: Employees = {
      idEmploye: formValues.idEmploye,
      nomEmploye: formValues.nomEmploye,
      prenomEmploye: formValues.prenomEmploye,
      posteEmploye: formValues.posteEmploye,
      dateEmbauche: formValues.dateEmbauche,
      salaire: formValues.salaire,
      email: formValues.email,
      telephone: formValues.telephone,
      adresse: formValues.adresse,
      grade: this.employeService.consulterGrade(formValues.idGra),
      showDetails: this.currentEmploye.showDetails
    };

    // 🔹 Mettre à jour dans le service correctement
    this.employeService.updateEmploye(updatedEmploye);

    this.router.navigate(['employe']);
  }
}
