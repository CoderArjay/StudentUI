import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ConnectService } from '../../../connect.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UploadAccountComponent } from '../upload-account/upload-account.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatIconModule, RouterModule,MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {
  
  user: any;
  profileImage: any;
  selectedFile: File | null = null;
  imageSelected: boolean = false;

  constructor (private conn: ConnectService){}

  profileForm = new FormGroup({
    LRN: new FormControl('',),
    fname: new FormControl(''),
    mname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    oldPassword: new FormControl(null),
    newPassword: new FormControl(''),
    newPassword_confirmation: new FormControl(''),
  })

  ngOnInit() {
    this.loadUserData();
    const user = JSON.parse(localStorage.getItem('student') || '{}');
    if (user && user.student_pic) {
      this.profileImage = user.student_pic;
  } else {
      console.warn('Student picture URL not found in localStorage');
  }
  }

  loadUserData(): void {
    const user = JSON.parse(localStorage.getItem('student') || '{}');
    this.user = user;
    console.log(user);

    if (user) {
      this.profileForm.patchValue({
        LRN: user.LRN,
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        email: user.email,
        address: user.address,
        oldPassword: user.oldPassword,
      });
    }

    if (user && user.student_pic) {
      this.profileImage = user.student_pic;
    } else {
      console.warn('Admin picture URL not found in localStorage');
    }
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
  
      const LRN = Number(formData.LRN);
      const oldPassword = formData.oldPassword ?? '';
  
      if (LRN <= 0 || !oldPassword) {
        console.error('Invalid admin ID or missing old password');
        Swal.fire({
          title: "Error",
          text: "Enter Old Password to save changes.",
          icon: "error"
        });
        return;
      }
      this.conn.updateAcc(LRN, oldPassword, {
        fname: formData.fname,
        mname: formData.mname,
        lname: formData.lname,
        email: formData.email,
        address: formData.address,
        newPassword: formData.newPassword,
        newPassword_confirmation: formData.newPassword_confirmation // Include confirmation if needed
      }).subscribe(
        (result) => {
          Swal.fire({
            title: "Success!",
            text: "Profile updated successfully!",
            icon: "success"
          });
          console.log('Profile updated successfully', result);
          const updatedUser = {
            ...this.user,
            fname: formData.fname,
            mname: formData.mname,
            lname: formData.lname,
            email: formData.email,
            address: formData.address,
          };
  
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.loadUserData();

          this.profileForm.patchValue({
            newPassword: '',
            newPassword_confirmation: ''
          });
        },
        (error) => {
          console.error('Error updating profile:', error);
          console.error('Error details:', error);
          Swal.fire({
            icon: "error",
            title: "Oopps! Validation Errors",
            html: `
              <p>The following issues need to be resolved:</p>
              <ul style="text-align: left;">
                <li>New password must be 8 characters long.</li>
                <li>Incorrect old password</li>
              </ul>
            `,
          });
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
  

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement; // Type assertion
    const file = target.files?.[0]; // Optional chaining to safely access files
    const user = JSON.parse(localStorage.getItem('student') || '{}'); // Retrieve student data from local storage

    if (file && user.LRN) {
        // Create a FileReader instance
        const reader = new FileReader();

        // Set up the onload event to handle the file once it's read
        reader.onload = (e) => {
            this.profileImage = e.target?.result as string; // Ensure e.target is not null

            // Now proceed with uploading the file
            const formData = new FormData();
            formData.append('student_pic', file); // Use 'student_pic' as per server validation
            formData.append('LRN', user.LRN); // Append LRN to FormData
        
            this.conn.uploadProfile(formData).subscribe(response => {
                console.log(response); 

                // Ensure the response contains the correct image URL
                if (response && response.image_url) {
                    this.profileImage = response.image_url; // Use image_url from response
                    
                    // Update local storage data with new student picture URL
                    user.student_pic = this.profileImage; // Update student_pic in user object
                    localStorage.setItem('student', JSON.stringify(user));  // Save updated user object back to local storage
                    
                    // Notify other components by updating the service
                    this.conn.updateStudentPic(this.profileImage); // Notify all subscribers
                    console.log('Student Picture URL:', this.profileImage);
                } else {
                    console.error('Invalid response structure:', response);
                }
            }, error => {
                console.error('Error uploading image:', error);
            });
        };

        // Read the file as a Data URL (base64)
        reader.readAsDataURL(file);
    } else {
        console.error('No file selected or student LRN is missing');
    }
}
}