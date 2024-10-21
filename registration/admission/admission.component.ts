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

@Component({
  selector: 'app-admission',
  standalone: true,
  imports: [FormsModule, CommonModule, MatListModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatDatepickerModule,MatNativeDateModule,MatSelectModule,
    MatInputModule,],
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.css']
})
export class AdmissionComponent {
  student = {
    LRN: '',
    school_year: '',
    fname: '',
    lname: '',
    grade_level: '',
    strand: '',
    email: '',
    password: ''
};

constructor(private router: Router, private conn: ConnectService) {}

    // Method to handle form submission
    register(form: any) {
        if (form.valid) {
        this.conn.createStudent(this.student).subscribe(
            response => {
            console.log('Student registered:', response);
            // Navigate to another page or show success message
            this.router.navigate(['/register/personal-information', { LRN: this.student.LRN }]);
            },
            error => {
            console.error('Error registering student:', error);
            // Handle error appropriately
            }
        );
        } else {
        console.error('Form is invalid');
        }
    }
}