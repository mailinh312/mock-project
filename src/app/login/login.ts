import { Component } from '@angular/core';
import { Auth } from '../../service/auth';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Validation } from '../../utils/validation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  formErrors: { [key: string]: string } = {};

  constructor(
    private auth: Auth,
    private router: Router,
    private formBuilder: FormBuilder,
    private validation: Validation
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    this.formErrors = {};
    this.loginForm.valueChanges.subscribe(
      () =>
        (this.formErrors = this.validation.validateRequiredFields(
          this.loginForm
        ))
    );
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.auth.login(username, password).subscribe({
        next: () => {
          const role = this.auth.getCurrentUser().role;
          this.router.navigate(['/home']);
        },
      });
      console.log('Login success');
    } else {
      this.formErrors = this.validation.validateRequiredFields(this.loginForm);
    }
  }
}
