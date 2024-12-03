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
          localStorage.setItem('LRN', result.student.LRN);
  
          // Navigate to personal information page
          this.router.navigate(['/main']);
        }
        console.log(result);
      }, (error) => {
        console.error('Login failed', error); // Handle login errors
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
