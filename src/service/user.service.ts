import { map, Observable } from 'rxjs';
import { User } from '../model/user';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserByUsername(username: string): Observable<User | null> {
    const apiUrl = 'http://localhost:3000/users';
    return this.http
      .get<User[]>(`${apiUrl}?username=${username}`)
      .pipe(map((users: any[]) => (users.length > 0 ? users[0] : null)));
  }

  getUserById(id: string): Observable<User | null> {
    const apiUrl = 'http://localhost:3000/users';
    return this.http
      .get<User[]>(`${apiUrl}?id=${id}`)
      .pipe(map((users: User[]) => (users.length > 0 ? users[0] : null)));
  }

  updateUser(id: string, data: Partial<User>): Observable<HttpResponse<User>> {
    return this.http.put<User>(`http://localhost:3000/users/${id}`, data, {
      observe: 'response',
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>('http://localhost:3000/users');
  }

  removeUserById(id: string): Observable<HttpResponse<User>>{
    return this.http.delete<User>(`http://localhost:3000/users/${id}`, {
      observe: 'response',
    });
  }
}
