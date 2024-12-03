import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConnectService } from '../../connect.service';

@Component({
  selector: 'app-payment-approval',
  standalone: true,
  imports: [MatListModule,RouterModule,],
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
  }

  retrievePaymentData(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (student) {
      this.fname = student.fname || '';
      this.lname = student.lname || '';
      this.grade_level = student.grade_level || ''; // Assuming grade_level is stored
      this.LRN = student.LRN || ''; // Retrieve LRN from localStorage
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
            console.log('Payment details response:', response); // Log the entire response
            this.paymentDate = response.date_of_payment; // Set date of payment
            this.amountPaid = parseFloat(response.amount_paid); // Ensure it's a number
            this.paymentApproved = response.payment_approval !== null;

            // Check if proof_payment URL is included in the response
            if (response.proof_payment) {
                this.paymentImage = response.proof_payment; // Get the URL for the proof of payment image
                console.log('Proof of Payment URL:', this.paymentImage); // Log for debugging
            } else {
                console.error('No proof of payment URL found in response.');
            }
            this.paymentApproved = response.payment_approval !== null;
        },
        error => {
            console.error('Error fetching payment details:', error);
        }
    );
}
}
