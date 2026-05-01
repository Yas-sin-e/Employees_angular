import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpServices } from '../services/emp-services';
import { Grade } from '../model/Grade.model';
import { Employees } from '../model/employees.model';
import { Image } from '../model/image.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-update-employe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-employe.html',
  styleUrls: ['./update-employe.css']
})
export class UpdateEmploye implements OnInit {

  editForm!: FormGroup;
  grades: Grade[] = [];
  currentEmploye!: Employees;

  uploadedImages: File[] = [];
  imagePreviews: string[] = [];
  isImageUpdated: boolean = false;
  imagesToDelete: Image[] = [];

  constructor(
    private fb: FormBuilder,
    private employeService: EmpServices,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];

    this.employeService.listegrades().subscribe(gr => {
      this.grades = gr;
    });

    this.employeService.consulterEmployee(id).subscribe(emp => {
      this.currentEmploye = emp;
      this.initForm();
      this.loadCurrentEmployeeImages();
    });
  }

  private loadCurrentEmployeeImages() {
    if (this.currentEmploye.idEmploye) {
      this.employeService.getImagesByEmp(this.currentEmploye.idEmploye).subscribe({
        next: (imgs: Image[]) => {
          if (imgs?.length) {
            this.currentEmploye.images = imgs;
            this.setImageStr(imgs[0]);
          } else {
            this.loadFallbackImage();
          }
        },
        error: () => this.loadFallbackImage()
      });
      return;
    }

    this.loadFallbackImage();
  }

  private loadFallbackImage() {
    if (this.currentEmploye.images?.length) {
      this.setImageStr(this.currentEmploye.images[0]);
    } else if (this.currentEmploye.image?.idImage) {
      this.employeService.loadImage(this.currentEmploye.image.idImage).subscribe((img: Image) => {
        this.setImageStr(img);
      });
    } else if (this.currentEmploye.imagePath && this.currentEmploye.idEmploye) {
      this.employeService.getImageFS(this.currentEmploye.idEmploye).subscribe(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          this.currentEmploye.imageStr = reader.result as string;
        };
        reader.readAsDataURL(blob);
      });
    }
  }

  private setImageStr(img: Image) {
    this.currentEmploye.imageStr = 'data:' + img.type + ';base64,' + img.image;
  }

  private initForm() {
    // Initialize form first with empty values
    this.editForm = this.fb.group({
      idEmploye: [''],
      nomEmploye: ['', [Validators.required, Validators.minLength(3)]],
      prenomEmploye: ['', Validators.required],
      posteEmploye: ['', Validators.required],
      dateEmbauche: ['', Validators.required],
      salaire: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      adresse: ['', Validators.required],
      idGra: ['', Validators.required]
    });

    // Then patch values from employee data
    setTimeout(() => {
      if (this.currentEmploye) {
        const dateStr = this.currentEmploye.dateEmbauche
          ? this.formatDateString(this.currentEmploye.dateEmbauche)
          : '';

        this.editForm.patchValue({
          idEmploye: this.currentEmploye.idEmploye,
          nomEmploye: this.currentEmploye.nomEmploye,
          prenomEmploye: this.currentEmploye.prenomEmploye,
          posteEmploye: this.currentEmploye.posteEmploye,
          dateEmbauche: dateStr,
          salaire: this.currentEmploye.salaire,
          email: this.currentEmploye.email,
          telephone: this.currentEmploye.telephone,
          adresse: this.currentEmploye.adresse,
          idGra: this.currentEmploye.grade?.idGraEmp
        });
      }
    }, 0);
  }

  // Convert string "yyyy-MM-dd" to Date object
  private convertToDate(dateString: string): Date | undefined {
    if (!dateString) return undefined;
    const parts = dateString.split('-');
    if (parts.length !== 3) return undefined;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  private formatDateString(date: any): string {
    if (!date) return '';
    // Handle both string and Date objects
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    // Format as yyyy-MM-dd (local timezone)
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  // Quand l'utilisateur change l'image
  onImageUpload(event: any) {
    if (event.target.files && event.target.files.length) {
      this.uploadedImages = [];
      this.imagePreviews = [];
      this.isImageUpdated = true;

      const files = event.target.files;
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
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  deleteExistingImage(img: Image) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      this.imagesToDelete.push(img);

      // Supprimer l'image du tableau d'affichage
      const index = this.currentEmploye.images?.indexOf(img) ?? -1;
      if (index > -1 && this.currentEmploye.images) {
        this.currentEmploye.images.splice(index, 1);
      }

      // Appeler le service pour supprimer l'image du serveur
      this.employeService.supprimerImage(img.idImage).subscribe({
        next: () => {
          console.log("Image supprimée avec succès");
        },
        error: err => console.error("Erreur suppression image:", err)
      });
    }
  }

  // Ajouter une seule image (bouton "Ajouter Image")
  onAddImageEmploye(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.uploadedImages.length === 0) {
      console.log("Aucune image sélectionnée");
      return;
    }

    const idEmp = this.currentEmploye.idEmploye;
    if (!idEmp) {
      console.error("ID employé non défini");
      return;
    }

    // Upload CHAQUE image séparément une par une
    this.uploadedImages.forEach(file => {
      this.employeService.uploadImageProd(file, file.name, idEmp).subscribe({
        next: (img: Image) => {
          if (!this.currentEmploye.images) {
            this.currentEmploye.images = [];
          }
          this.currentEmploye.images.push(img);
          console.log("Image ajoutée avec succès:", img.name);
        },
        error: err => console.error("Erreur upload image:", err)
      });
    });

    // Vider les fichiers après upload
    this.uploadedImages = [];
    this.imagePreviews = [];
  }

  triggerFileInput() {
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  updateEmploye() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const form = this.editForm.value;
    const selectedGrade = this.grades.find(g => g.idGraEmp === form.idGra)!;

    // Convert date from string to Date object
    const dateValue = this.convertToDate(form.dateEmbauche);

    // Exclure les images supprimées
    const remainingImages = this.currentEmploye.images?.filter(img =>
      !this.imagesToDelete.includes(img)
    ) ?? [];

    const updatedEmploye: Employees = {
      idEmploye: form.idEmploye,
      nomEmploye: form.nomEmploye,
      prenomEmploye: form.prenomEmploye,
      posteEmploye: form.posteEmploye,
      dateEmbauche: dateValue,
      salaire: form.salaire,
      email: form.email,
      telephone: form.telephone,
      adresse: form.adresse,
      grade: selectedGrade,
      showDetails: this.currentEmploye.showDetails,
      images: remainingImages,
      imagePath: this.currentEmploye.imagePath
    };

    if (this.isImageUpdated && this.uploadedImages.length > 0) {
      this.employeService.updateEmp(updatedEmploye).subscribe({
        next: (savedEmp) => {
          const idEmp = savedEmp.idEmploye ?? form.idEmploye;
          const uploads = this.uploadedImages.map(file =>
            this.employeService.uploadImageProd(file, file.name, idEmp)
          );

          forkJoin(uploads).subscribe({
            next: () => this.router.navigate(['/employe']),
            error: err => console.error("Erreur upload images employé:", err)
          });
        },
        error: err => console.error("Erreur modification employé:", err)
      });
    } else {
      // Image non changée → update direct
      this.employeService.updateEmp(updatedEmploye).subscribe(() => {
        this.router.navigate(['/employe']);
      });
    }
  }
}
