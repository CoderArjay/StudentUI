import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
export class LoginComponent implements OnInit {
  

  ngOnInit(): void {
  }

  constructor(private dialog: MatDialog) {}

  openAdmissionRequirementsDialog(): void {
    this.dialog.open(AdmissionRequirementsComponent);
  }

  openEnrollmentProceduresDialog(): void {
    this.dialog.open(EnrollmentProceduresComponent);
  }
}
