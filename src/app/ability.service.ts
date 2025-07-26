import { Injectable } from '@angular/core';
import { Ability } from '@casl/ability';
import { Auth } from '../service/auth';

@Injectable({
  providedIn: 'root'
})
export class AbilityService {

  constructor(
    private ability: Ability,
    private authService: Auth
  ) {}

  async updateAbility(): Promise<void> {
    try {
      const user = await this.authService.getCurrentUserWithPermissions();
      
      if (!user) {
        // Nếu không có user, xóa tất cả quyền
        this.ability.update([]);
        return;
      }

      const rules: any[] = [];

      // Nếu là admin, có tất cả quyền
      if (user.role === 'admin') {
        rules.push({ action: 'manage', subject: 'all' });
      } else {
        // Quyền cơ bản cho user đã đăng nhập
        rules.push({ action: 'read', subject: 'profile' });
        
        // Thêm các quyền dựa trên permissions
        if (user.permissions && user.permissions.length > 0) {
          user.permissions.forEach((permission: string) => {
            // Giả sử permission có format "action:subject"
            const parts = permission.split(':');
            if (parts.length === 2) {
              rules.push({ action: parts[0], subject: parts[1] });
            } else {
              // Nếu không có format chuẩn, coi như là action trên 'all'
              rules.push({ action: permission, subject: 'all' });
            }
          });
        }
      }

      this.ability.update(rules);
      console.log('Ability updated with rules:', rules);
    } catch (error) {
      console.error('Error updating ability:', error);
      this.ability.update([]);
    }
  }

  can(action: string, subject: string): boolean {
    return this.ability.can(action, subject);
  }

  cannot(action: string, subject: string): boolean {
    return this.ability.cannot(action, subject);
  }
}

