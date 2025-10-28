import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Employees } from '../model/employees.model';
import { EmpServices } from '../services/emp-services';
import { ActivatedRoute, Router,  } from '@angular/router';
import { Grade } from '../model/Grade.model';

@Component({
  selector: 'app-add-employe',
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './add-employe.html',
})
export class AddEmploye {
  empForm!: FormGroup;
  grades!: Grade[];
  newEmploye = new Employees();

  constructor(
    private formBuilder: FormBuilder,
    private employeService: EmpServices,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.grades = this.employeService.listegrades();

    // ✅ Validators complets
    this.empForm = this.formBuilder.group({
      idEmploye: ['', [Validators.required]],
      nomEmploye: ['', [Validators.required, Validators.minLength(3)]], // minLength
      prenomEmploye: ['', Validators.required],
      posteEmploye: ['', Validators.required],
      dateEmbauche: ['', Validators.required],
      salaire: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{8}$/)], // 8 chiffres
      ],
      adresse: ['', Validators.required],
      idGra: ['', Validators.required],
    });
  }

  addEmploye() {
    if (this.empForm.invalid) {
      this.empForm.markAllAsTouched();
      return;
    }

    const formValues = this.empForm.value;
    this.newEmploye = {
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
      showDetails: false,
    };

    this.employeService.ajouteremp(this.newEmploye);
    this.router.navigate(['employe']);
  }
}
