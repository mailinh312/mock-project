import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../model/role';
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}
  getAllRolesName(): Observable<string[]> {
    return this.http
      .get<Role[]>('http://localhost:3000/roles')
      .pipe(map((roleList) => roleList.map((r) => r.roleName)));
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:3000/roles');
  }

  updateRole(id: number, data: Partial<Role>): Observable<HttpResponse<Role>> {
    return this.http.put<Role>(`http://localhost:3000/roles/${id}`, data, {
      observe: 'response',
    });
  }

  getRoleByName(name: string): Observable<Role> {
    return this.http
      .get<Role[]>(`http://localhost:3000/roles?roleName=${name}`)
      .pipe(map((roles) => roles[0]));
  }
}
