import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule, MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConnectService } from '../../connect.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatNativeDateModule,
    RouterModule,
    MatListModule,
    CommonModule
  ],
  templateUrl: './personal-information.component.html',
  styleUrl: './personal-information.component.css'
})
export class PersonalInformationComponent implements OnInit {
  student: any = {
    LRN: '',
    fname: '',
    lname: '',
    mname: '',
    suffix: '',
    bdate: '',
    bplace: '',
    gender: '',
    religion: '',
    address: '',
    contact_no: ''
};

constructor(private conn: ConnectService, private route: ActivatedRoute, private router: Router) {}

ngOnInit(): void {
    this.route.params.subscribe(params => {
        const LRN = params['LRN']; // Get LRN from route parameters
        this.fetchStudentInfo(LRN); // Fetch existing student information
    });
}

fetchStudentInfo(LRN: number): void {
    this.conn.getStudent(LRN).subscribe(
        (response) => {
            this.student = response; // Populate the form with existing data
        },
        (error) => {
            console.error('Error fetching student information:', error);
        }
    );
}



  onSubmit() {
    const bdate = new Date(this.student.bdate);
    // Check if the date is valid before formatting
    const formattedBdate = isNaN(bdate.getTime()) ? null : bdate.toISOString().split('T')[0]; 

    // Prepare data for update
    const studentData = {
      LRN: this.student.LRN, // Include LRN for the update request
      fname: this.student.fname,
      lname: this.student.lname,
      mname: this.student.mname,
      suffix: this.student.suffix,
      bdate: formattedBdate,
      bplace: this.student.bplace,
      gender: this.student.gender,
      religion: this.student.religion,
      address: this.student.address,
      contact_no: this.student.contact_no,
    };

    

    // Call the update method in the service
    this.conn.update(studentData).subscribe(
      response => {
        console.log('Student updated successfully:', response);

        // 
        this.router.navigate(['/register/enrollment-details', { LRN: this.student.LRN }]); // Navigate after successful update
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating student:', error);
      }
    );
}
}
