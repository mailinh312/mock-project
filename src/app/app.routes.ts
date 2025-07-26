import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Register } from './register/register';
import { UserManagement } from './user.management/user.management';
import { Profile } from './profile/profile';
import { UserDetail } from './user.detail/user.detail';
import { PermissionManagement } from './permission/permission';
import { CaslAbilityGuard } from './casl-ability.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'home',
    component: Home,
    children: [
      { 
        path: 'profile', 
        component: Profile,
        canActivate: [CaslAbilityGuard],
        data: { action: 'read', subject: 'profile' }
      },
      {
        path: 'user-management',
        component: UserManagement,
        canActivate: [CaslAbilityGuard],
        data: { action: 'manage', subject: 'user' },
      },
      { 
        path: 'permission', 
        component: PermissionManagement,
        canActivate: [CaslAbilityGuard],
        data: { action: 'manage', subject: 'permission' }
      }
    ],
  },
  { 
    path: 'user-detail/:id', 
    component: UserDetail,
    canActivate: [CaslAbilityGuard],
    data: { action: 'read', subject: 'user' }
  },
  { 
    path: 'profile', 
    component: Profile,
    canActivate: [CaslAbilityGuard],
    data: { action: 'read', subject: 'profile' }
  },
  { path: 'register', component: Register },
  { 
    path: 'permission', 
    component: PermissionManagement,
    canActivate: [CaslAbilityGuard],
    data: { action: 'manage', subject: 'permission' }
  },
  { path: '**', redirectTo: 'login' },
];
