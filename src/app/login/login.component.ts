import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConnectService } from '../connect.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AdmissionRequirementsComponent } from '../admission-requirements/admission-requirements.component';
import { EnrollmentProceduresComponent } from '../enrollment-procedures/enrollment-procedures.component';
import { EnrollmentStateService } from '../enrollment-state.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [ConnectService],
  imports: [FormsModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  constructor(
    private conn: ConnectService,
    private router: Router,
    private dialog: MatDialog,
    private enrollmentStateService: EnrollmentStateService
  ) {}


  loginform = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  login() {
    if (this.loginform.valid) {
        this.conn.login(this.loginform.value).subscribe((result: any) => {
            if (result.token != null) {
                // Save the token in local storage
                localStorage.setItem('token', result.token); 
                localStorage.setItem('student', JSON.stringify(result.student));
                localStorage.setItem('LRN', result.student.LRN);

                // Fetch student data to check enrollment status
                this.fetchStudentData(result.student.LRN);
            }
            console.log(result);
        }, (error) => {
            console.error('Login failed', error); // Handle login errors
            
            // Display SweetAlert for error
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.error.message || 'An unexpected error occurred. Please try again.',
                confirmButtonText: 'OK'
            });
        });
    } 
}

fetchStudentData(lrn: string) {
  console.log('Fetching student data for LRN:', lrn); // Log the LRN
  this.conn.getStudentData(lrn).subscribe(
      (student) => {
          console.log('Student data received:', student); // Log the entire student object
          
          if (student) {
              // Check enrollment completion status
              const isEnrollmentComplete = !!student.gender && !!student.grade_level && !!student.proof_payment && !!student.payment_approval && !!student.regapproval_date;

              if (!isEnrollmentComplete) {
                  console.warn('Enrollment process not completed. Cannot log in.');

                  // Determine which process is incomplete
                  let missingProcess = '';
                  if (!student.gender) {
                      missingProcess = 'personal information';
                      this.router.navigate(['/register/personal-information']);
                  } else if (!student.grade_level) {
                      missingProcess = 'enrollment details';
                      this.router.navigate(['/register/enrollment-details']);
                  } else if (!student.proof_payment) {
                      missingProcess = 'payment proof';
                      this.router.navigate(['/register/payment']);
                  } else if (!student.payment_approval) {
                      missingProcess = 'DSF approval';
                      this.router.navigate(['/register/dsf-approval']);
                  } else if (!student.regapproval_date) {
                      missingProcess = 'registration confirmation';
                      this.router.navigate(['/register/confirmation']);
                  }
                  
                  // Show SweetAlert with the missing process
                  Swal.fire({
                      icon: 'warning',
                      title: 'Enrollment Incomplete',
                      text: `You must complete the ${missingProcess} process before logging in.`,
                      confirmButtonText: 'OK'
                  });

                  return; // Exit if enrollment is not complete
              }

              // Set enrollment state flags
              this.enrollmentStateService.personalInfoSubmitted = !!student.gender; 
              this.enrollmentStateService.enrollmentDetailsSubmitted = !!student.grade_level; 
              this.enrollmentStateService.paymentSubmitted = !!student.proof_payment; 
              this.enrollmentStateService.dsfApproved = !!student.payment_approval; 
              this.enrollmentStateService.registrarApproved = !!student.regapproval_date; 

              // Log each property to see if they are undefined
              console.log('Gender:', student.gender);
              console.log('Grade Level:', student.grade_level);
              console.log('Proof of Payment:', student.proof_payment);
              console.log('Payment Approval:', student.payment_approval);
              console.log('Registration Approval:', student.regapproval_date);

              // Navigate to personal information page after successful checks
              this.router.navigate(['/main']);
          } else {
              console.warn('No student data found');
          }
      },
      (error) => {
          console.error('Error fetching student data', error);
      }
  );
}
  
  openAdmissionRequirementsDialog(): void {
    this.dialog.open(AdmissionRequirementsComponent);
  }

  openEnrollmentProceduresDialog(): void {
    this.dialog.open(EnrollmentProceduresComponent);
  }
}
