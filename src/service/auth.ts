import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, tap } from 'rxjs';
import { RoleService } from './role.service';
import { PermissionService } from './permission.service';
import { permission } from 'process';
import { Role } from '../model/role';
import { Permission } from '../model/permission';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  login(username: string, password: string) {
    return this.http
      .get<any[]>(`${this.apiUrl}?username=${username}&password=${password}`)
      .pipe(
        tap((users) => {
          if (users.length > 0) {
            const user = users[0];
            sessionStorage.setItem('currentUser', JSON.stringify(user));
          } else {
            throw new Error('Invalid cresentials');
          }
        })
      );
  }

  register(user: { username: string; password: string; role: string }) {
    return this.http.post(this.apiUrl, user);
  }

  getCurrentUser(): any {
    if (typeof window !== 'undefined') {
      const currentUser = sessionStorage.getItem('currentUser');
      return currentUser ? JSON.parse(currentUser) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  async hasPermission(perm: string): Promise<boolean> {
    const currentUser = this.getCurrentUser();
    console.log('role ' + currentUser.role);
    const role = await firstValueFrom(
      this.roleService.getRoleByName(currentUser.role)
    );
    if (!role.permissions || role.permissions.length === 0) {
      console.warn('❌ Role has no permissions!');
      return false;
    }
    const permissions = await firstValueFrom(
      this.permissionService.getPermissionsByListIds(role.permissions)
    );
    console.log('permission' + permissions[0]);
    return permissions.some((p) => p.name === perm);
  }

  // Thêm method mới để lấy thông tin user với permissions cho CASL
  async getCurrentUserWithPermissions(): Promise<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    try {
      const role = await firstValueFrom(
        this.roleService.getRoleByName(currentUser.role)
      );
      
      let permissions: string[] = [];
      if (role.permissions && role.permissions.length > 0) {
        const permissionObjects = await firstValueFrom(
          this.permissionService.getPermissionsByListIds(role.permissions)
        );
        permissions = permissionObjects.map(p => p.name);
      }

      return {
        ...currentUser,
        permissions
      };
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return currentUser;
    }
  }
}
