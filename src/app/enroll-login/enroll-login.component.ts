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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enroll-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule,MatButtonModule],
  templateUrl: './enroll-login.component.html',
  styleUrl: './enroll-login.component.css'
})
export class EnrollLoginComponent {
  student: any = {
    LRN: '',
    fname: '',
    lname: '',
    mname: '',
    bdate: '',
    email: '',
    password: ''
};

  constructor(
    private conn: ConnectService,
    private router: Router,
    private dialog: MatDialog
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
                

                // Show success alert
                Swal.fire({
                    title: "Success!",
                    text: "Login successful. Welcome!",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    // Navigate to personal information page after alert is closed
                    this.router.navigate(['/register/personal-information']);
                });
            }
            console.log(result);
        }, (error) => {
            console.error('Login failed', error); // Handle login errors
            // Show error alert
            Swal.fire({
                title: "Error!",
                text: "Login failed. Please check your credentials and try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
        });
    } else {
        Swal.fire({
            title: "Warning!",
            text: "Please fill in all required fields.",
            icon: "warning",
            confirmButtonText: "OK"
        });
    }
}
  
  openAdmissionRequirementsDialog(): void {
    this.dialog.open(AdmissionRequirementsComponent);
  }

  openEnrollmentProceduresDialog(): void {
    this.dialog.open(EnrollmentProceduresComponent);
  }
}
