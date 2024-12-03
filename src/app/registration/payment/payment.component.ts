import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConnectService } from '../../connect.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, MatListModule, RouterModule, CommonModule, FormsModule, ReactiveFormsModule,MatFormFieldModule,MatInputModule],
  changeDetection: ChangeDetectionStrategy.Default, // Changed to Default
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  // amount_paid: number | undefined;
  
  enrollment: any = {
    LRN: '',
    last_attended: '',
    public_private: '',
    guardian_name: '',
    contact_no: '',
    grade_level: '',
    strand: '',
    school_year: '',
  };
  
  student: any; // This will hold the student data fetched from local storage
  fname: string = '';
  lname: string = '';
  tuitionDetails: any = {};
  selectedFile: File | null = null;
  LRN: string | undefined;
  amount_paid: any;
  description: string = '';
  date_of_payment!: string;
  
  constructor(private conn: ConnectService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const studentData = localStorage.getItem('student');
    const today = new Date();
    this.date_of_payment = today.toISOString().split('T')[0];

    if (studentData) {
      this.student = JSON.parse(studentData); // Parse and assign the student data
      console.log('Student data retrieved from local storage:', this.student);
      this.LRN = this.student.LRN; // Retrieve LRN from student data
      this.fetchTuitionDetails();
    } else {
      console.error('No student data found in local storage.');
      // Optionally, navigate away or show an error message
      this.router.navigate(['/error']); // Example navigation on error
    }
    
  }

  fetchTuitionDetails(): void {
    if (this.LRN) {
      const lrnNumber = parseInt(this.LRN, 10); // Convert string to number
      console.log('Fetching tuition details for LRN:', lrnNumber);

      this.conn.getTuitionDetails(lrnNumber).subscribe(
        (response: any) => {
          if (response && response.tuition) {
            this.tuitionDetails = response;
            this.formatTuitionDetails();
          } else {
            console.error('Tuition details not found');
            alert('Tuition details not found for the given LRN.');
          }
        },
        error => {
          console.error('Error fetching tuition details:', error);
          alert('Failed to retrieve tuition details. Please try again later.');
        }
      );
    } else {
      console.error('No LRN found in student data.');
      alert('Learner Reference Number (LRN) is required to fetch tuition details.');
    }
  }

  fetchEnrollmentInfo(LRN: string): void {
    const lrnNumber = parseInt(LRN, 10); // Convert LRN to number for API call
    this.conn.getEnrollmentByLRN(lrnNumber).subscribe(
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

  formatTuitionDetails(): void {
    if (this.tuitionDetails) {
      const fieldsToFormat = ['tuition', 'general', 'esc', 'subsidy', 'req_downpayment'];
      fieldsToFormat.forEach(field => {
        if (this.tuitionDetails[field]) {
          this.tuitionDetails[field] = parseFloat(this.tuitionDetails[field].replace(',', '')).toFixed(2);
        }
      });
    } else {
      console.error('No tuition details found.');
    }
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      console.log(`Selected file: ${this.selectedFile.name}`);
    }
  }

  onSubmit(): void {
    // Check if a proof of payment file has been selected
    if (!this.selectedFile || !this.amount_paid || this.amount_paid <= 0 || !this.description) {
        Swal.fire({
            title: "Error!",
            text: "Please select a proof of payment file before submitting.",
            icon: "error",
            confirmButtonText: "OK"
        });

        Swal.fire({
          title: "Error!",
          text: "Please enter a valid amount paid.",
          icon: "error",
          confirmButtonText: "OK"
      });

      Swal.fire({
        title: "Error!",
        text: "Please provide a description.",
        icon: "error",
        confirmButtonText: "OK"
    });
        return;
    }

    // // Check if amount_paid is valid
    // if (!this.amount_paid || this.amount_paid <= 0) {
       
    //     return;
    // }

    // // Check if description is provided
    // if (!this.description) {
        
    //     return;
    // }

    const formData = new FormData();
    formData.append('LRN', this.LRN || ''); // Ensure LRN is appended safely
    formData.append('amount_paid', this.amount_paid.toString()); // Append amount_paid as string
    formData.append('proof_payment', this.selectedFile); // Append the selected file
    formData.append('description', this.description); // Append description
    formData.append('date_of_payment', this.date_of_payment);

    // Call the service to upload payment proof
    this.conn.uploadPaymentProof(formData).subscribe(
        response => {
            console.log('Upload successful:', response);
            Swal.fire({
                title: "Success!",
                text: "Your payment has been successfully uploaded. Please wait for the DSF approval.",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                this.router.navigate(['/register/dsf-approval']);
            });
        },
        error => {
            console.error('Upload failed:', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to upload payment proof. Please try again later.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    );
}
}