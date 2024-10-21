import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectService } from '../../connect.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-enrollment-details',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,],
  templateUrl: './enrollment-details.component.html',
  styleUrl: './enrollment-details.component.css'
})
export class EnrollmentDetailsComponent {
  enrollment: any = {
    LRN: '',
    last_attended: '',
    public_private: '',
    guardian_name: '',
    contact_no: ''
  };

  constructor(private route: ActivatedRoute, private conn: ConnectService, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const LRN = params['LRN']; // Get LRN from route parameters
      console.log('Fetching enrollment for LRN:', LRN); // Debug log
      this.fetchEnrollmentInfo(LRN); // Fetch existing enrollment information
    });
  }

  fetchEnrollmentInfo(LRN: number): void {
    this.conn.getEnrollmentByLRN(LRN).subscribe(
      (response) => {
        this.enrollment = response; // Update local enrollment object with fetched data
        console.log('Fetched updated enrollment:', this.enrollment);
      },
      (error) => {
        console.error('Error fetching updated enrollment:', error);
        alert('Failed to fetch updated enrollment data.');
      }
    );
  }

  onSubmit() {
    if (!this.enrollment.LRN) {
      console.error('LRN is required for updating enrollment.');
      alert('Please provide a valid Learner Reference Number (LRN).');
      return; // Prevent submission if LRN is not provided
    }

    const enrollmentData = {
      LRN: this.enrollment.LRN, // Include LRN for the update request
      last_attended: this.enrollment.last_attended,
      public_private: this.enrollment.public_private,
      guardian_name: this.enrollment.guardian_name,
      contact_no: this.enrollment.contact_no,
    };

    // Update enrollment data
    this.conn.updateEnrollment(enrollmentData).subscribe(
      response => {
        console.log('Enrollment updated:', response);
        this.router.navigate(['/login']); // Navigate after successful update
      },
      error => {
        console.error('Error updating enrollment:', error);
        alert('An error occurred while updating enrollment. Please try again.');
      }
    );
  }
  
}
