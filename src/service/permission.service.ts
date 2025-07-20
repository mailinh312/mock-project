import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Permission } from '../model/permission';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private http: HttpClient) {}

  getAllPermissions(): Observable<Permission[]> {
    return this.http
      .get<any[]>('http://localhost:3000/permissions');
  }

 getPermissionsByListIds(ids: number[]): Observable<Permission[]> {
  const query = ids.map(id => `id=${id}`).join('&');
  console.log(query);
  return this.http.get<Permission[]>(`http://localhost:3000/permissions?${query}`);
}
}

