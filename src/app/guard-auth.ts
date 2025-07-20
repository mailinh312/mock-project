import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../service/auth';

@Injectable({
  providedIn: 'root'
})
export class GuardAuth {

  constructor(private auth: Auth, private router: Router) { }

  canActivate() : boolean{
     if(this.auth.isLoggedIn()){
      this.router.navigate(['/login']);
      return false;
     }
     return true;
  }
}
