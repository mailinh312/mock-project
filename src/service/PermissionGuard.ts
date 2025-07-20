import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Auth } from './auth';
import { RoleService } from './role.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {

  constructor(private authService: Auth, private router: Router, private roleService: RoleService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const requiredPermission = route.data['permission'];

    const allowed = await this.authService.hasPermission(requiredPermission);
    console.log("access: " + allowed);
    if (allowed) {
      return true;
    }

    alert("Ban không có quyền truy cập trang này.");
    return false;
  }
}