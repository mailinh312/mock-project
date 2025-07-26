import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Ability } from '@casl/ability';
import { Auth } from '../service/auth';
import { AbilityService } from './ability.service';

@Injectable({ providedIn: 'root' })
export class CaslAbilityGuard implements CanActivate {

  constructor(
    private ability: Ability,
    private authService: Auth,
    private router: Router,
    private abilityService: AbilityService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const requiredAction = route.data['action'] || 'read';
    const requiredSubject = route.data['subject'] || 'all';

    // Đảm bảo ability được cập nhật với thông tin user hiện tại
    await this.abilityService.updateAbility();

    const allowed = this.ability.can(requiredAction, requiredSubject);
    
    console.log(`Checking permission: ${requiredAction} on ${requiredSubject} - Result: ${allowed}`);
    
    if (allowed) {
      return true;
    }

    alert("Bạn không có quyền truy cập trang này.");
    this.router.navigate(['/login']);
    return false;
  }
}

