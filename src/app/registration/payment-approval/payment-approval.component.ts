import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConnectService } from '../../connect.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-approval',
  standalone: true,
  imports: [MatListModule,RouterModule,CommonModule],
  templateUrl: './payment-approval.component.html',
  styleUrl: './payment-approval.component.css'
})
export class PaymentApprovalComponent implements OnInit {
  paymentImage!: string;
  fname: string = '';
  lname: string = '';
  grade_level: string = '';
  paymentDate: string = ''; // To hold date of payment
  amountPaid: number | null = null; // To hold amount paid
  LRN: string = ''; // To hold LRN
  paymentApproved: boolean = false;

  constructor(private conn: ConnectService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.retrievePaymentData(); // Retrieve student data on init
    this.getPaymentDetails(); // Fetch payment details by LRN
    this.getEnrollmentDetails(this.LRN); // Fetch enrollment details
  }

  retrievePaymentData(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (student) {
      this.fname = student.fname || '';
      this.lname = student.lname || '';
      this.LRN = student.LRN || ''; // Retrieve LRN from localStorage

      if (student.enrollment) {
        this.grade_level = student.enrollment.grade_level || ''; // Retrieve grade level from enrollment
    } else {
        console.error('Enrollment data not found.');
    }
    } else {
      console.error('No payment data found.');
    }
  }

  getPaymentDetails(): void {
    if (!this.LRN) {
        console.error('LRN is not available.');
        return;
    }

    this.conn.getPaymentDetails(this.LRN).subscribe(
        response => {
            console.log('Payment details response:', response);
            this.paymentDate = response.date_of_payment;
            this.amountPaid = parseFloat(response.amount_paid);
            this.paymentApproved = response.payment_approval !== null;

            if (response.proof_payment) {
                this.paymentImage = response.proof_payment;
                console.log('Proof of Payment URL:', this.paymentImage);
            } else {
                console.error('No proof of payment URL found in response.');
            }
        },
        error => {
            console.error('Error fetching payment details:', error);
        }
    );
}

getEnrollmentDetails(LRN: string): void {
  if (!LRN) {
      console.error('LRN is not available.');
      return;
  }

  this.conn.getStudentData(LRN).subscribe(
      enrollmentResponse => {
          console.log('Enrollment details response:', enrollmentResponse);
          // Update paymentApproved based on enrollmentResponse.payment_approval
          this.paymentApproved = enrollmentResponse.payment_approval !== null;
      },
      error => {
          console.error('Error fetching enrollment details:', error);
      }
  );
}
}