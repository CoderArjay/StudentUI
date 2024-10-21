import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getAnnouncements(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/announcement');
  }

  getClass(LRN: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8000/api/student/classes/${LRN}`);
  }


  getSubject(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/subjects');
  }

  getGrade(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/student-report/${LRN}');
  }

  printSOA(LRN: number): Observable<any> {
    return this.http.get<any>(`${this.url}displaySOA/${LRN}`);
  }

  getStudent(LRN: number): Observable<any> {
    return this.http.get(`${this.url}students/${LRN}`); // Assuming you have a route set up for this
}

  getStudentInfo(LRN: number): Observable<any> {
    return this.http.get(`${this.url}students/${LRN}`); 
  }
  
  update(studentData: any): Observable<any> {
    return this.http.put(`${this.url}students/${studentData.LRN}`, studentData); // Use LRN for URL
  }

  getEnrollmentByLRN(LRN: number): Observable<any> {
    return this.http.get(`${this.url}enrollments/${LRN}`);
  }
  
  updateEnrollment(enrollmentData: any): Observable<any> {
    return this.http.put(`${this.url}enrollments/${enrollmentData.LRN}`, enrollmentData);
  }

  getTuitionDetails(LRN: number): Observable<any> {
    return this.http.get(`${this.url}students/${LRN}/tuition-details`);
  }

  uploadPaymentProof(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8000/api/payments', formData);
  }

  getPaymentDetails(lrn: string): Observable<any> {
    return this.http.get(`${this.url}payments/lrn/${lrn}`);
  }

  uploadProfile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}` // Replace with actual token
    });
    return this.http.post(`${this.url}students/upload-profile`, formData, { headers });
}

  getProfileImage(LRN: string): Observable<any> {
    return this.http.get(`${this.url}students/${LRN}/profile-image`);
  }


  getStudents(): Observable<any> {
    return this.http.get<any[]>('http://localhost:8000/api/students');
  }

  getAttendanceReport(LRN: string): Observable<any> {
    return this.http.get(`${this.url}attendance-report/${LRN}`);
}


sendMessage(messageData: any): Observable<any> {
  return this.http.post(`${this.url}messages`, messageData);
}

getMessages(userId: number): Observable<any> {
  return this.http.get(`${this.url}messages?user_id=${userId}`);
}



}
