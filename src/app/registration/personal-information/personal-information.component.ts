import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule, MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { NgForm } from '@angular/forms';
import { ConnectService } from '../../connect.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { EnrollmentStateService } from '../../enrollment-state.service';

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
  @Output() submitted = new EventEmitter<boolean>();

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

  constructor(
    private conn: ConnectService,
    private router: Router,
    private enrollmentStateService: EnrollmentStateService // Inject your state service
  ) {}

  myDateFilter = (date: Date | null): boolean => {
    const currentYear = new Date().getFullYear();
    return date ? date.getFullYear() < currentYear : true; // Disable current year dates
  };

  ngOnInit(): void {
    // Retrieve student information from local storage
    const studentData = localStorage.getItem('student');
        
    if (studentData) {
      this.student = JSON.parse(studentData); // Parse and assign the student data
      console.log('Student data retrieved from local storage:', this.student);
    } else {
      console.error('No student data found in local storage.');
      // Optionally, you can navigate away or show an error message
      this.router.navigate(['/error']); // Example navigation on error
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const bdate = new Date(this.student.bdate);
      const formattedBdate = isNaN(bdate.getTime()) ? null : bdate.toISOString().split('T')[0]; 

      // Prepare data for update
      const studentData = {
        ...this.student, // Spread operator to include all properties from this.student
        bdate: formattedBdate,
      };

      // Call the update method in the service
      this.conn.update(studentData).subscribe(
        response => {
          console.log('Student updated successfully:', response);
          this.enrollmentStateService.personalInfoSubmitted = true; // Update state in service
          this.submitted.emit(true); // Emit event for parent component
          this.router.navigate(['/register/enrollment-details']); // Navigate after successful update
        },
        error => {
          console.error('Error updating student:', error);
          // Optionally handle error (e.g., show a notification)
        }
      );
    }
  }

  // Helper method to format date
  private formatDate(dateString: string): string | null {
    const bdate = new Date(dateString);
    return isNaN(bdate.getTime()) ? null : bdate.toISOString().split('T')[0];
  }
}
