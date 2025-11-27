import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpServices } from '../services/emp-services';
import { Grade } from '../model/Grade.model';
import { Employees } from '../model/employees.model';

@Component({
  selector: 'app-update-employe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-employe.html'
})
export class UpdateEmploye implements OnInit {
  editForm!: FormGroup;
  grades: Grade[] = [];
  currentEmploye!: Employees;
  updateGradeid! :number|null;

  constructor(
    private fb: FormBuilder,
    private employeService: EmpServices,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];

    // Récupérer l'employé depuis le service
    this.employeService.consulterEmployee(id).subscribe(emp => {
      this.currentEmploye = emp;
      this.initForm();
    });

    // Récupérer les grades
    this.employeService.listegrades().subscribe(gr => {
      this.grades = gr;
    });
  }

  private initForm() {
    const dateString = this.currentEmploye.dateEmbauche
      ? this.formatDate(this.currentEmploye.dateEmbauche)
      : ''; // si undefined, mettre une chaîne vide

    this.editForm = this.fb.group({
      idEmploye: [this.currentEmploye.idEmploye, Validators.required],
      nomEmploye: [this.currentEmploye.nomEmploye, [Validators.required, Validators.minLength(3)]],
      prenomEmploye: [this.currentEmploye.prenomEmploye, Validators.required],
      posteEmploye: [this.currentEmploye.posteEmploye, Validators.required],
      dateEmbauche: [dateString, Validators.required],
      salaire: [this.currentEmploye.salaire, [Validators.required, Validators.min(1)]],
      email: [this.currentEmploye.email, [Validators.required, Validators.email]],
      telephone: [this.currentEmploye.telephone, [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      adresse: [this.currentEmploye.adresse, Validators.required],
      idGra: [this.currentEmploye.grade?.idGraEmp, Validators.required]
    });
  }
 onGradeChange(idGra: any) {
  const selectedGrade = this.grades.find(g => g.idGraEmp === +idGra);
  if (selectedGrade) {
    // Met à jour le FormControl pour idGra
    this.editForm.patchValue({ idGra: selectedGrade.idGraEmp });
    // Met à jour l'objet currentEmploye pour la soumission
    this.currentEmploye.grade = selectedGrade;
  }
}
  formatDate(date?: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  updateEmploye() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }


    const formValues = this.editForm.value;

    // Construire l'objet grade sélectionné
    const selectedGrade = this.grades.find(g => g.idGraEmp === formValues.idGra)!;

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
      grade: selectedGrade,
      showDetails: this.currentEmploye.showDetails
    };

    // 🔹 Mettre à jour dans le service
    this.employeService.updateEmp(updatedEmploye).subscribe(() => {
      this.router.navigate(['employe']);
    });
  }
}
