import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { Auth } from '../../service/auth';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  username = '';
  constructor(private auth: Auth){};

ngOnInit(): void {
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.username;
    }
  }
}
