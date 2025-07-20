import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class Validation{

  constructor(private http: HttpClient, private userService: UserService){}

validateRequiredField(
  form: FormGroup,
  field: string,
  errorKeyPrefix: string = ''
): { [key: string]: string } {
  const errors: { [key: string]: string } = {};
  const control = form.get(field);
  const keyPrefix = errorKeyPrefix || field;

  if (control && (control.touched || control.dirty)) {
    if (control.hasError('required')) {
      errors[`${keyPrefix}-required`] = `${field} không được để trống`;
    }
  }
  return errors;
}
 
validateRequiredFields(form: FormGroup) : { [key: string]: string }{
    const fields: string[] = ['username', 'password'];
    const errors: { [key: string]: string } = {};
    fields.forEach(field => {
      Object.assign(errors, this.validateRequiredField(form, field));
    });
    return errors;
}

validateExistUser(username: string):Observable<{ [key: string]: string }>{
     return this.userService.getUserByUsername(username).pipe(
    map(user => {
      const errors: { [key: string]: string } = {};
      if (user) {
        errors['username-existed'] = 'Tên đăng nhập đã tồn tại';
      }
      return errors;
    })
  );
  }
}