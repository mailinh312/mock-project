import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Validation } from '../../utils/validation';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';
import { Auth } from '../../service/auth';
import { RoleService } from '../../service/role.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  profileForm: FormGroup;
  formErrors: { [key: string]: string } = {};
  userId: string | null = null;
  roles: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private validation: Validation,
    private userService: UserService,
    private auth: Auth,
    private roleService: RoleService
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.formErrors = {};
    this.profileForm.valueChanges.subscribe(
      () =>
        (this.formErrors = this.validation.validateRequiredFields(
          this.profileForm
        ))
    );
  }

  ngOnInit(): void {
    const currentUser = this.auth.getCurrentUser();
  
    this.roleService.getAllRolesName().subscribe((roles) => {
    this.roles = roles;

    if (currentUser) {
      this.userId = currentUser.id;
      this.profileForm.patchValue({
        username: currentUser.username,
        password: currentUser.password,
        role: currentUser.role, // gán khi đã có roles
      });

      this.profileForm.get('username')?.disable();
      if (currentUser.role !== 'admin') {
        this.profileForm.get('role')?.disable();
      }
    }
  });
  }

  updateProfile() {
    const formValue = this.profileForm.getRawValue();
    const currentUser = this.auth.getCurrentUser();
    currentUser.password = formValue.password;
    currentUser.role = formValue.role;
    this.userService
      .updateUser(currentUser.id, currentUser)
      .subscribe((response) => {
        if (response.status === 200) {
          sessionStorage.setItem('currentUser', JSON.stringify(response.body));
          alert('Cập nhật thành công!');
        } else {
          alert(`Có lỗi xảy ra: ${response.status}`);
        }
      });
  }
}
