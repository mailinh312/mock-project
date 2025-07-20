import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Route, RouterModule } from '@angular/router';
import { Validation } from '../../utils/validation';
import { UserService } from '../../service/user.service';
import { Auth } from '../../service/auth';
import { User } from '../../model/user';
import { RoleService } from '../../service/role.service';

@Component({
  selector: 'app-user.detail',
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user.detail.html',
  styleUrl: './user.detail.css',
})
export class UserDetail implements OnInit {
  userForm: FormGroup;
  formErrors: { [key: string]: string } = {};
  userId: string | null = null;
  user: User = {
    id: '',
    username: '',
    password: '',
    role: '',
  };
  roles: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private validation: Validation,
    private userService: UserService,
    private auth: Auth,
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.formErrors = {};
    this.userForm.valueChanges.subscribe(
      () =>
        (this.formErrors = this.validation.validateRequiredFields(
          this.userForm
        ))
    );
  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.userService.getUserById(this.userId).subscribe(user => this.user = user!);

    this.roleService.getAllRolesName().subscribe((roles) => {
      this.roles = roles;

      if (this.user) {
        this.userForm.patchValue({
          username: this.user.username,
          password: this.user.password,
          role: this.user.role, // gán khi đã có roles
        });

        this.userForm.get('username')?.disable();
      }
    });
  }

  updateProfile() {
    const formValue = this.userForm.getRawValue();
    this.user.password = formValue.password;
    this.user.role = formValue.role;
    this.userService
      .updateUser(this.user.id, this.user)
      .subscribe((response) => {
        if (response.status === 200) {
          alert('Cập nhật thành công!');
        } else {
          alert(`Có lỗi xảy ra: ${response.status}`);
        }
      });
  }
}
