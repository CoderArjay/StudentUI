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
import { StepperComponent } from '../../Modules/enrollment/stepper/stepper.component';

@Component({
  selector: 'app-enrollment-details',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatTooltipModule,
    StepperComponent],
  templateUrl: './enrollment-details.component.html',
  styleUrl: './enrollment-details.component.css'
})
export class EnrollmentDetailsComponent {
  enrollment: any = {
    LRN: '',
    last_attended: '',
    public_private: '',
    guardian_name: '',
    guardian_no: '',
    grade_level: '',
    strand: '',
  };

  constructor(private route: ActivatedRoute, private conn: ConnectService, private router: Router) {}

  ngOnInit(): void {
    const studentData = localStorage.getItem('student');

    if (studentData) {
      this.enrollment = JSON.parse(studentData); // Parse and assign the student data
      console.log('Student data retrieved from local storage:', this.enrollment);
    } else {
      console.error('No student data found in local storage.');
      // Optionally, you can navigate away or show an error message
      this.router.navigate(['/error']); // Example navigation on error
    }

    
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
    this.conn.createEnrollment(enrollmentData).subscribe(
        response => {
            console.log('Enrollment created:', response);
            Swal.fire({
                title: "Success!",
                text: "Enrollment created successfully.",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                // Navigate after successful creation
                this.router.navigate(['register/payment']);
            });

            // Check if student data exists in the response and update it in local storage
            if (response.student) {
                // Store new student data in local storage under 'student' key
                localStorage.setItem('student', JSON.stringify(response.student));
                console.log('Student data stored in local storage:', response.student);
            } else {
                console.warn('No student data returned in the response.');
            }

            // Create a new key called 'enrollment' and set it in local storage
            const enrollmentInfo = {
                grade_level: this.enrollment.grade_level,
            };

            localStorage.setItem('enrollment', JSON.stringify(enrollmentInfo));
            console.log('New enrollment info stored in local storage:', enrollmentInfo);
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
