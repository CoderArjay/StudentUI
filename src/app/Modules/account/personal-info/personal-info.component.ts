import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ConnectService } from '../../../connect.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UploadAccountComponent } from '../upload-account/upload-account.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatIconModule, RouterModule,MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {
  hide1 = signal(true);
  hide2 = signal(true);
  fname: string = '';
  lname: string = '';
  mname: string = '';
  contact_no: string = '';
  email: string = '';
  lrn: string = '';
  profileImage: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  message: string | null = null;
  success: boolean = false;

  constructor(private conn: ConnectService, private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.retrieveStudentData(); // Fetch student data on init
    const LRN = JSON.parse(localStorage.getItem('student') || '{}').LRN; // Retrieve LRN from local storage
    if (LRN) {
      this.retrieveProfileImage(LRN); // Fetch profile image if LRN is valid
    } else {
      console.error('LRN not found in local storage.');
    }
  }

  retrieveStudentData(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (student) {
      this.fname = student.fname || '';
      this.lname = student.lname || '';
      this.mname = student.mname || ''; // Assuming mname is stored
      this.contact_no = student.contact_no || ''; // Assuming contact_no is stored
      this.email = student.email || ''; // Assuming email is stored
      this.lrn = student.LRN || ''; // Assuming LRN is stored
    } else {
      console.error('No student data found.');
    }
  }

  retrieveProfileImage(LRN: string): void {
    this.conn.getProfileImage(LRN).subscribe(
      response => {
        if (response.image_url) {
          this.profileImage = response.image_url; 
          console.log('Image URL:', this.profileImage); 
        } else {
          console.error('No image URL found in response.');
        }
      },
      error => {
        console.error('Error fetching profile image:', error);
      }
    );
  }


  openUploadImageDialog(): void {
    this.dialog.open(UploadAccountComponent);
  }

  
  clickEvent(event: MouseEvent) {
    this.hide1.set(!this.hide1());
    event.stopPropagation();
  }

  clickEvent2(event: MouseEvent) {
    this.hide2.set(!this.hide2());
    event.stopPropagation();
  }

  onSubmit(): void {
    // Check if password and confirmation match
    if (this.password !== this.passwordConfirmation) {
      this.message = 'Passwords do not match!';
      this.success = false;
      return;
    }

    const payload = {
      LRN: this.lrn,  // Ensure LRN is included in the payload
      password: this.password
    };

    console.log('Payload:', payload); // Log the payload for debugging

    this.http.post('http://localhost:8000/api/update-password', payload).subscribe(
      response => {
        this.message = 'Password updated successfully!';
        this.success = true;
      },
      error => {
        this.message = 'An error occurred while updating the password.';
        this.success = false;
        console.error('Error details:', error); // Log error details for debugging
      }
    );
  }
  
}