import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectService {
  url = "http://localhost:8000/api/";
  token = localStorage.getItem('token');
  getCookie: any;

  private StudentsImages = new BehaviorSubject<string | null>(null); 
  studentPic$ = this.StudentsImages.asObservable();

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

  getClass(lrn: string): Observable<any> {
    return this.http.get<any>(`${this.url}classes/${lrn}`); // Assuming your endpoint is structured like this
  }

   getNotifications(lrn: string): Observable<any> {
    return this.http.get(`${this.url}notifications?LRN=${lrn}`);
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
  
  createEnrollment(enrollmentData: any): Observable<any> {
    return this.http.post(`${this.url}enrollments`, enrollmentData); // Use POST for creation
}

  getTuitionDetails(LRN: number): Observable<any> {
    return this.http.get(`${this.url}students/${LRN}/tuition-details`);
  }

  uploadPaymentProof(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8000/api/payments', formData);
  }

  getPaymentDetails(lrn: string): Observable<any> {
    return this.http.get(`${this.url}payment/${lrn}`); // Adjust endpoint as necessary
}

  uploadProfile(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8000/api/students/upload-profile', formData);
  }

  updateStudentPic(newImageUrl: string) {
    this.StudentsImages.next(newImageUrl); // Emit new image URL
  } 

getProfileImage(lrn: string): Observable<any> {
  return this.http.get(`${this.url}students/${lrn}/profile-image`);
}


  getStudents(): Observable<any> {
    return this.http.get<any[]>('http://localhost:8000/api/students');
  }

  getAttendanceReport(LRN: string, currentWeekStart: Date, currentWeekEnd: Date): Observable<any> {
    return this.http.get(`${this.url}attendance-report/${LRN}`);
}

 // message
 getMessages(uid: any){
  return this.http.get(this.url + 'getMessages', {params: {uid: uid}});
}
getConvo(sid: any, uid: any){
  return this.http.get(this.url + 'getConvo/' + sid , {params: {uid: uid}});
}

sendMessage(mdata: any):Observable<any>{
  return this.http.post(this.url + 'sendMessage', mdata );
}

// sendMessage(messageData: any): Observable<any> {
//   return this.http.post(`${this.url}sendMessage`, messageData);
// }
getRecipients(): Observable<any[]> {
  return this.http.get<any[]>(this.url + 'getrecepeints');
}
composeMessage(messageData: any): Observable<any> {
  return this.http.post(this.url + 'composemessage', messageData);
}

markAsRead(sid: any){
  return this.http.post(this.url + 'markAsRead', {sid});
}

getUnreadMessagesCount(uid: any) {
  const params = new HttpParams().set('uid', uid);
  return this.http.get(this.url + 'getUnreadCount', {params});
}

getAdmins(){
  return this.http.get(this.url + 'getAdmin');
}

getFinancialStatement(LRN: string): Observable<any> {
  return this.http.get(`${this.url}financial-statement/${LRN}`);
}

getLatestMessages(uid: any): Observable<any[]> {
  return this.http.get<any[]>(`${this.url}latest-messages`, { params: { uid } });
}

// Fetch student data by LRN
  getStudentData(lrn: string): Observable<any> {
    return this.http.get(`${this.url}student/${lrn}`);
  }

  getProofPayment(lrn: string): Observable<any> {
    return this.http.get(`${this.url}students/${lrn}/payment`);
  }

  newPayment(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}submit-payment`, formData);
  }


  updateAcc(LRN: number, oldPassword: string, newData: any): Observable<any> {
    return this.http.put(`${this.url}updatePassword`, {
      LRN: LRN,
      oldPassword: oldPassword,
      ...newData
    });
  }
  
  getPaymentHistory(lrn: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}payments/history/${lrn}`);
  }


  getAnnouncementCount(uid: string): Observable<number> {
    const params = new HttpParams().set('LRN', uid); // Assuming LRN is used as uid
    return this.http.get<any[]>(`${this.url}notifications`, { params }).pipe(
      map(notifications => notifications.filter(notification => notification.type === 'announcement').length)
    );
  }

  // Get the list of announcements
  getAnnouncement(uid: string): Observable<any[]> {
    const params = new HttpParams().set('LRN', uid); 
    return this.http.get<any[]>(`${this.url}notifications`, { params }).pipe(
      map(notifications => notifications.filter(notification => notification.type === 'announcement'))
    );
  }

  // Mark announcements as viewed
  markAsViewed(sid: string): Observable<any> {
    return this.http.post(`${this.url}notifications/viewed`, { sid });
  }
  
}
