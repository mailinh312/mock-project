import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Register } from './register/register';
import { UserManagement } from './user.management/user.management';
import { Profile } from './profile/profile';
import { UserDetail } from './user.detail/user.detail';
import { PermissionManagement } from './permission/permission';
import { PermissionGuard } from '../service/PermissionGuard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'home',
    component: Home,
    children: [
      { path: 'profile', component: Profile },
      {
        path: 'user-management',
        component: UserManagement,
        canActivate: [PermissionGuard],
        data: { permission: 'user-management:get' },
      },
      { path: 'permission', component: PermissionManagement }
    ],
  },
  { path: 'user-detail/:id', component: UserDetail },
  { path: 'profile', component: Profile },
  { path: 'register', component: Register },
  { path: 'permission', component: PermissionManagement },
  { path: '**', redirectTo: 'login' },
];
