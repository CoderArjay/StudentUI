import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Route, Router } from '@angular/router';
import { ConnectService } from '../../connect.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admission',
  standalone: true,
  imports: [FormsModule, CommonModule, MatListModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatDatepickerModule,MatNativeDateModule,MatSelectModule,
    MatInputModule,],
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.css']
})
export class AdmissionComponent {
  student: any = {
    LRN: '',
    fname: '',
    lname: '',
    mname: '',
    bdate: '',
    email: '',
    password: ''
  };

  constructor(private router: Router, private conn: ConnectService) {}

  // Method to handle form submission
  register(form: any) {
    const bdate = new Date(this.student.bdate);
    // Format to 'YYYY-MM-DD'
    const formattedBdate = isNaN(bdate.getTime()) ? null : bdate.toISOString().split('T')[0]; 

    const enrollmentData = {
      LRN: this.student.LRN,
      fname: this.student.fname,
      lname: this.student.lname,
      mname: this.student.mname,
      bdate: formattedBdate, // Use formatted date here
      email: this.student.email,
      password: this.student.password,
    };

    if (form.valid) {
      this.conn.createStudent(enrollmentData).subscribe(
        response => {
          console.log('Student registered:', response);
          // Success alert
          Swal.fire({
            title: 'Success!',
            text: 'Student registered successfully! Please remember your email and password.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/enroll-login']);
            localStorage.setItem('student', JSON.stringify(enrollmentData));
          });
        },
        error => {
          console.error('Error registering student:', error);
          // Error alert
          Swal.fire({
            title: 'Error!',
            text: 'Failed to register student. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      console.error('Form is invalid');
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill out all required fields correctly.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
}