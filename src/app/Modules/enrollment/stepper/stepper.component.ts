import {Component, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ConnectService } from '../../../connect.service';
import { NgForm } from '@angular/forms';
import { EnrollmentStateService } from '../../../enrollment-state.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-stepper',
  standalone: true,
 
  imports: [
    MatListModule,
    MatIconModule,
    CommonModule, // Add CommonModule here
    FormsModule, // Add FormsModule here
    MatInputModule,
  ],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  providers: []
})
export class StepperComponent implements OnInit {
  enrollmentId!: string; // Declare enrollmentId without initializing it

  constructor(
    public enrollmentStateService: EnrollmentStateService,
    private connectService: ConnectService
  ) {}

  ngOnInit() {
    // Retrieve the student data from localStorage
    const studentData = localStorage.getItem('student');
    
    if (studentData) {
      const student = JSON.parse(studentData); // Parse the JSON string
      this.enrollmentId = student.LRN; // Assuming LRN is a property of the student object
      this.fetchStudentData(this.enrollmentId);
    } else {
      console.warn('No student data found in localStorage');
    }
  }

  fetchStudentData(lrn: string) {
    console.log('Fetching student data for LRN:', lrn); // Log the LRN
    this.connectService.getStudentData(lrn).subscribe(
      (student) => {
        console.log('Student data received:', student); // Log the entire student object
        
        if (student) {
          this.enrollmentStateService.personalInfoSubmitted = !!student.gender; // Check if gender is set
          this.enrollmentStateService.enrollmentDetailsSubmitted = !!student.grade_level; // Check if grade level is set
          this.enrollmentStateService.paymentSubmitted = !!student.proof_payment; // Check payment approval status
          this.enrollmentStateService.dsfApproved = !!student.payment_approval; // Check payment approval status
          this.enrollmentStateService.registrarApproved = !!student.regapproval_date; // Check payment approval status

          // Log each property to see if they are undefined
          console.log('Gender:', student.gender);
          console.log('Grade Level:', student.grade_level);
          console.log('Proof of Payment:', student.proof_payment);
          console.log('Payment Approval:', student.payment_approval);
          // console.log('Student Contract:', student.student_contract);
          console.log('Registration Approval:', student.regapproval_date);
        } else {
          console.warn('No student data found');
        }
      },
      (error) => {
        console.error('Error fetching student data', error);
      }
    );
  }
}