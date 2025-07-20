import { Component } from '@angular/core';
import { Role } from '../../model/role';
import { Permission } from '../../model/permission';
import { RoleService } from '../../service/role.service';
import { PermissionService } from '../../service/permission.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permission.html',
  styleUrl: './permission.css',
})
export class PermissionManagement {
  roles: Role[] = [];
  permissions: Permission[] = [];
  selectedRoleId!: number;
  selectedPermissionIds: number[] = [];

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.roleService.getAllRoles().subscribe((data) => (this.roles = data || []));
    this.permissionService.getAllPermissions().subscribe((data) => (this.permissions = data || []));
  }

  loadRolePermissions() {
    const role = this.roles.find((r) => r.id === this.selectedRoleId);
    if (role) {
      this.selectedPermissionIds = [...role.permissions];
    }
  }

  togglePermission(id: number, checked: boolean) {
    if (checked) {
      if (!this.selectedPermissionIds.includes(id)) {
        this.selectedPermissionIds.push(id);
      }
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter((p) => p !== id);
    }
  }

  onCheckboxChange(event: Event, permId: number): void {
  const inputElement = event.target as HTMLInputElement;
  const checked = inputElement.checked;
  this.togglePermission(permId, checked);
}

  savePermissions() {
    const roleIndex = this.roles.findIndex((r) => r.id === this.selectedRoleId);
    if (roleIndex === -1) return;

    const updatedRole: Role = {
      ...this.roles[roleIndex],
      permissions: [...this.selectedPermissionIds],
    };

    this.roleService.updateRole(updatedRole.id, updatedRole).subscribe(() => {
      alert('Cập nhật quyền thành công!');
      this.roles[roleIndex] = updatedRole; // cập nhật lại local role
    });
  }
}
