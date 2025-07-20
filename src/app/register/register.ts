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
import { CommonModule } from '@angular/common';
import { Validation } from '../../utils/validation';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  formErrors: { [key: string]: string } = {};

  constructor(
    private auth: Auth,
    private router: Router,
    private formBuilder: FormBuilder,
    private validation: Validation
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    this.formErrors = {};
    this.registerForm.valueChanges.subscribe(
      () =>
        (this.formErrors = this.validation.validateRequiredFields(
          this.registerForm
        ))
    );
  }
  register() {
    if (this.registerForm.valid) {
      this.formErrors = {};
      const { username, password } = this.registerForm.value;
      this.validation.validateExistUser(username).subscribe((errors) => {
        if (Object.keys(errors).length !== 0) {
          console.log(Object.keys(errors)[0]);
          this.formErrors = errors;
        } else {
          const role: string = 'user';
          this.auth.register({ username, password, role }).subscribe({
            next: (res) => {
              console.log('Đăng ký thành công', res);
              this.router.navigate(['/login']);
            },
          });
        }
      });
    } else {
      this.formErrors = this.validation.validateRequiredFields(
        this.registerForm
      );
    }
  }
}
