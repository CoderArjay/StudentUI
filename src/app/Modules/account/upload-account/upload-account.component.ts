import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EnrollmentProceduresComponent } from '../../../enrollment-procedures/enrollment-procedures.component';
import { FormsModule } from '@angular/forms';
import { ConnectService } from '../../../connect.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-account',
  standalone: true,
  imports: [MatDialogModule,FormsModule, CommonModule],
  templateUrl: './upload-account.component.html',
  styleUrl: './upload-account.component.css'
})
export class UploadAccountComponent {
  selectedFile: File | null = null;
  imageSelected: boolean = false;
  profileImage: string = '';

  constructor(public dialogRef: MatDialogRef<EnrollmentProceduresComponent>, private conn: ConnectService, private router: Router) {}

    onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0]; // Store the selected file
      if (this.selectedFile) {
          this.imageSelected = true; // Set flag to true when an image is selected
          const reader = new FileReader();
          reader.onload = (e) => {
              this.profileImage = e.target?.result as string; // Preview the selected image
          };
          reader.readAsDataURL(this.selectedFile); // Read the file as a data URL for preview
      }
  }

  uploadProfile(event: Event): void {
    event.preventDefault();
    if (!this.selectedFile) {
        console.error('No file selected!');
        Swal.fire({
            title: "Error!",
            text: "No file selected! Please choose a file to upload.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    const formData = new FormData();
    formData.append('student_pic', this.selectedFile, this.selectedFile.name);

    this.conn.uploadProfile(formData).subscribe(
        response => {
            console.log('Profile updated successfully!', response);
            Swal.fire({
                title: "Success!",
                text: "Profile image uploaded successfully!",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                // Optionally, you can perform additional actions here after the alert is closed
                this.imageSelected = false; 
                this.selectedFile = null; 
                this.close();
            });
        },
        error => {
            console.error('Error uploading profile:', error);
            Swal.fire({
                title: "Error!",
                text: "An error occurred while uploading the profile image. Please try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    );
}

  close(): void {
    this.dialogRef.close();
  }

}
