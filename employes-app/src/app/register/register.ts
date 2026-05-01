import { Component, OnInit } from '@angular/core'; // ← AJOUTER OnInit
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../model/user.model';
import { Auth } from '../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true, // ← AJOUTER
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
})
export class Register implements OnInit { // ← OnInit maintenant reconnu

  public user = new User();
  myForm!: FormGroup;
  err: string = '';
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      username:        ['', [Validators.required]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

 onRegister() {
    this.loading = true;
    this.err = ''; // ← reset l'erreur précédente

    this.user.username = this.myForm.get('username')?.value;
    this.user.email    = this.myForm.get('email')?.value;
    this.user.password = this.myForm.get('password')?.value;

    this.authService.registerUser(this.user).subscribe({
      next: (res) => {
        this.loading = false; // ← spinner s'arrête
        this.authService.setRegisteredUser(this.user);
        // alert('Veuillez confirmer votre email');
         this.toastr.success('veillez confirmer votre email', 'Confirmation');
        this.router.navigate(['/verifEmail']);
      },
      error: (err: any) => {
        this.loading = false; // ← TOUJOURS arrêter le spinner ici aussi
        if (err.status === 400) {
          this.err = err.error.message;
        } else {
          this.err = 'Une erreur est survenue';
        }
      }
    });

}
}
