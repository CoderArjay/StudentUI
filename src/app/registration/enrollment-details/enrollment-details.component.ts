import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectService } from '../../connect.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-enrollment-details',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatTooltipModule],
  templateUrl: './enrollment-details.component.html',
  styleUrl: './enrollment-details.component.css'
})
export class EnrollmentDetailsComponent {
  enrollment: any = {
    LRN: '',
    last_attended: '',
    public_private: '',
    guardian_name: '',
    contact_no: '',
    grade_level: '',
    strand: '',
    school_year: ''
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
    this.conn.getStudentInfo(LRN).subscribe(
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
    // Check if LRN is provided
    if (!this.enrollment.LRN) {
        console.error('LRN is required for creating enrollment.');
        Swal.fire({
            title: "Error!",
            text: "Please provide a valid Learner Reference Number (LRN).",
            icon: "error",
            confirmButtonText: "OK"
        });
        return; // Prevent submission if LRN is not provided
    }

    // Prepare enrollment data for the create request
    const enrollmentData = {
      ...this.enrollment,
    };

    // Create enrollment data
    this.conn.createEnrollment(enrollmentData).subscribe( // Call createEnrollment instead of updateEnrollment
        response => {
            console.log('Enrollment created:', response);
            Swal.fire({
                title: "Success!",
                text: "Enrollment created successfully.",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                // Navigate after successful creation
                this.router.navigate(['/register/payment']); // Use existingLRN here
            });

            // Check if student data exists in the response and store it in local storage
            if (response.student) {
                localStorage.setItem('student', JSON.stringify(response.student)); // Store student data
                console.log('Student data stored in local storage:', response.student);
            } else {
                console.warn('No student data returned in the response.');
            }
        },
        error => {
            console.error('Error creating enrollment:', error);
            Swal.fire({
                title: "Error!",
                text: "An error occurred while creating enrollment. Please try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    );
}
  
}
