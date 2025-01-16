import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConnectService } from '../../connect.service';
import { StepperComponent } from '../../Modules/enrollment/stepper/stepper.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [RouterModule, CommonModule, StepperComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  reg_approval: boolean = false;
  LRN: string = '';

  constructor(private http: HttpClient, private conn: ConnectService) {}

  ngOnInit(): void {
    this.retrieveLRN(); // Call method to retrieve LRN
    if (this.LRN) {
      this.getEnrollmentDetails(this.LRN); // Only call if LRN is available
    } else {
      console.error('LRN is not available.');
    }
  }

  retrieveLRN(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    this.LRN = student.LRN || ''; // Retrieve LRN from local storage
  }

  getEnrollmentDetails(LRN: string): void {
    if (!LRN) {
      console.error('LRN is not available.');
      return;
    }

    this.conn.getStudentData(LRN).subscribe(
      enrollmentResponse => {
        console.log('Enrollment details response:', enrollmentResponse);
        // Update reg_approval based on enrollmentResponse.regapproval_date
        this.reg_approval = enrollmentResponse.regapproval_date !== null;
      },
      error => {
        console.error('Error fetching enrollment details:', error);
      }
    );
  }
}
