import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { Auth } from '../../service/auth';
import { AblePipe } from '@casl/angular';
import { AbilityService } from '../ability.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterLink, AblePipe, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  username = '';
  
  constructor(
    private auth: Auth,
    private abilityService: AbilityService
  ) {}

  async ngOnInit(): Promise<void> {
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.username;
      // Cập nhật ability khi component được khởi tạo
      await this.abilityService.updateAbility();
    }
  }
}
