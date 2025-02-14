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
import { StepperComponent } from '../../Modules/enrollment/stepper/stepper.component';
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse

interface Enrollment {
  LRN: string;
  last_attended: string;
  public_private: string;
  guardian_name: string;
  guardian_no: string;
  grade_level: string;
  strand: string;
  school_year: string;
}

interface Payment {
  proof_payment: string;
  amount_paid: number;
  date_of_payment: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, MatListModule, RouterModule, CommonModule, FormsModule, ReactiveFormsModule,MatFormFieldModule,MatInputModule, StepperComponent],
  changeDetection: ChangeDetectionStrategy.Default, // Changed to Default
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  enrollment: Enrollment = {
    LRN: '',
    last_attended: '',
    public_private: '',
    guardian_name: '',
    guardian_no: '',
    grade_level: '',
    strand: '',
    school_year: '',
  };

  paymentHistory: Payment[] = [];
  enrollmentId!: string;
  student!: {
    fname: string;
    lname: string; LRN: string; grade_level: string 
  }; // Define student type
  fname = '';
  lname = '';
  tuitionDetails: any = {};
  selectedFile: File | null = null;
  LRN?: string; // Optional type
  amount_paid?: number; // Use number for amount
  description = '';
  date_of_payment!: string;

  constructor(private conn: ConnectService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const studentData = localStorage.getItem('student');
    const enrollmentData = localStorage.getItem('enrollment');
    const today = new Date();
    this.date_of_payment = today.toISOString().split('T')[0];

    // Check if student data exists
    if (studentData) {
        this.student = JSON.parse(studentData);
        console.log('Student data retrieved from local storage:', this.student);
        
        // Set first name and last name
        this.fname = this.student.fname; // Adjust according to your actual property names
        this.lname = this.student.lname;   // Adjust according to your actual property names
        
        this.LRN = this.student.LRN; 
        this.enrollmentId = this.student.LRN; 
        this.fetchPaymentHistory(this.enrollmentId);
        this.fetchTuitionDetails();
        this.enrollment.grade_level = this.student.grade_level;
    } else {
        console.error('No student data found in local storage.');
        this.router.navigate(['/error']); // Example navigation on error
    }

    // Check if enrollment data exists
    if (enrollmentData) {
        this.enrollment = JSON.parse(enrollmentData);
        console.log('Enrollment data retrieved from local storage:', this.enrollment);
    } else {
        console.warn('No enrollment data found in local storage.');
        // Optionally handle absence of enrollment data
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
      const fieldsToFormat = ['old_account','tuition', 'general', 'esc', 'subsidy', 'req_downpayment'];
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
    // Create a FormData object to hold the form data
    const formData = new FormData();
    
    // Ensure LRN is appended safely
    if (this.LRN) {
        formData.append('LRN', this.LRN);
    } else {
        Swal.fire({
            title: "Error!",
            text: "Please enter a valid LRN.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return; // Stop execution if LRN is not provided
    }

    // Append optional fields, allowing them to be empty
    formData.append('amount_paid', this.amount_paid ? this.amount_paid.toString() : ''); // Append amount_paid as string or empty
    formData.append('proof_payment', this.selectedFile || ''); // Append the selected file or empty
    formData.append('description', this.description || ''); // Append description or empty
    formData.append('date_of_payment', this.date_of_payment || ''); // Append date_of_payment or empty

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


calculateTotalBalance(): number {
  const oldAccount = parseFloat(this.tuitionDetails?.old_account || '0');
  const tuition = parseFloat(this.tuitionDetails?.tuition || '0');
  const generalFees = parseFloat(this.tuitionDetails?.general || '0');
  const esc = parseFloat(this.tuitionDetails?.esc || '0');

  // Total balance calculation
  return oldAccount + tuition + generalFees; // Note: ESC is not included in the total balance
}

calculateDownPaymentNoEsc(): number {
  // Get the total balance from calculateTotalBalance
  const totalBalance = this.calculateTotalBalance();
  const esc = parseFloat(this.tuitionDetails?.esc || '0');

  
  // Calculate 40% of the total balance
  const fortyPercentOfBalance = totalBalance - esc ;

  // Parse down payment and ESC
  // const downPayment = parseFloat(this.tuitionDetails?.req_downpayment || '0');

  // Calculate down payment without ESC
  const result = fortyPercentOfBalance * 0.40;

  // Return 0 if the result is negative
  return result < 0 ? 0 : result; 
}


fetchPaymentHistory(lrn: string): void {
  this.conn.getPaymentHistory(lrn).subscribe(
    (payments) => {
      console.log('Payment history received:', payments);
      this.paymentHistory = payments; // Store payment history in the component property
    },
    (error: HttpErrorResponse) => { 
      console.error('Error fetching payment history', error.message); // Log only the error message for clarity
      // Optionally, you could display an error message to the user here
    }
  );
}

}