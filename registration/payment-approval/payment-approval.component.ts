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
  fname: string = '';
  lname: string = '';
  grade_level: string = '';
  paymentDate: string = ''; // To hold date of payment
  amountPaid: number | null = null; // To hold amount paid
  LRN: string = ''; // To hold LRN

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
        this.paymentDate = response.date_of_payment; // Set date of payment
        this.amountPaid = parseFloat(response.amount_paid); // Ensure it's a number
      },
      error => {
        console.error('Error fetching payment details:', error);
      }
    );
  }
}
