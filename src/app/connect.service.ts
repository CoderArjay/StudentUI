import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectService {
  url = "http://localhost:8000/api/";
  token = localStorage.getItem('token');
  getCookie: any;

  constructor(private http: HttpClient ) { }

  saveToken(token: string): void {
    this.token = token; // Save the token in the service
    localStorage.setItem('token', token); // Optionally save it to localStorage
  }


  login(data: any){
    return this.http.post(this.url + 'Studentlogin', data);
  }

  logout(): Observable<any>{
    const headers = {'Authorization': 'Bearer' + this.token}
    return this.http.post(this.url + 'Studentlogout', {}, {headers} );
  }

  createStudent(studentData: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/enrollment', studentData);
  }
}
