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
    lrn: '',
    fname: '',
    lname: '',
    mname: '',
    bdate: '',
    glevel: '',
    strand: ''
  };

  constructor(private router: Router) {}

  // Method to handle form submission
  register(form: any) {
    if (this.student.bdate) {
      const date = new Date(this.student.bdate);
      this.student.bdate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }
    if (form.valid) {
      this.router.navigate(['/login']);
    }
  }
}