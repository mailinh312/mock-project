import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [CommonModule, RouterLink],
  templateUrl: './user.management.html',
  styleUrl: './user.management.css',
})
export class UserManagement implements OnInit {
  users: User[] = [];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  removeUser(id: string) {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa người dùng này?'
    );
    if (confirmed) {
      this.userService.removeUserById(id).subscribe((response) => {
        if (response.status === 200) {
          alert('Xóa người dùng thành công, load lại trang để xem cập nhật.');
        } else {
          alert(`Có lỗi xảy ra: ${response.status}`);
        }
      });
    } 
  }
}
