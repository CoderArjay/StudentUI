import { Component, OnInit } from '@angular/core';
import { ConnectService } from '../../../connect.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {  MatTabsModule} from '@angular/material/tabs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-financial-statement',
  standalone: true,
  imports: [ RouterModule, 
    MatToolbarModule, MatButtonModule, 
    MatIconModule, MatSidenavModule, MatBadgeModule, 
    MatMenuModule, MatListModule, CommonModule,MatTabsModule, FormsModule],
  templateUrl: './financial-statement.component.html',
  styleUrl: './financial-statement.component.css'
})
export class FinancialStatementComponent implements OnInit {
  fname: string = '';
  lname: string = '';
  grade_level: string = '';
  currentDate: Date = new Date();
  payments: any[] = [];
  documents: any[] = [];
  LRN: string = '';
  selectedImage: string = '';
  private intervalId: any;
  amount_paid: number | undefined;
  paymentMethod!: string;
  selectedFile: File | null = null;
  description: string = '';
  date_of_payment!: string;

  constructor(private conn: ConnectService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveStudentData();
    const today = new Date();
    this.date_of_payment = today.toISOString().split('T')[0];

    // Fetch financial statement using LRN from local storage
    if (this.LRN) {
      this.fetchFinancialStatement(this.LRN);
    } else {
      console.error('LRN is not available in local storage.');
    }
    
    this.intervalId = setInterval(() => {
      this.fetchFinancialStatement(this.LRN);
    }, 1000);

  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Clear the interval on component destroy
  }

  retrieveStudentData(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (student && student.LRN) {
      this.fname = student.fname || '';
      this.lname = student.lname || '';
      this.grade_level = student.grade_level || '';
      this.LRN = student.LRN; // Assuming LRN is stored in local storage
    } else {
      console.error('No student data found or LRN is missing.');
    }
  }

  fetchFinancialStatement(LRN: string): void {
    this.conn.getFinancialStatement(LRN).subscribe(
      response => {
        this.payments = response.payments || []; // Default to empty array if undefined
        // Update documents to include full URLs
        this.documents = response.documents.map((doc: { filename: any; }) => ({
          ...doc,
          url: `http://localhost:8000/storage/financials/${doc.filename}` // Construct full URL
        })) || []; // Default to empty array if undefined
      },
      error => {
        console.error('Error fetching financial statement:', error);
      }
    );
  }

  openModal(imageUrl: string): void {
    Swal.fire({
      title: 'Image Preview',
      imageUrl: imageUrl,
      imageWidth: 500, 
      imageHeight: 400, 
      imageAlt: 'Document Image',
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Close'
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  openNewPaymentAlert(): void {
    Swal.fire({
        title: 'New Payment',
        html: `
            <form id="paymentForm" class="justify-content-start align-items-start">
                <div class="form-group">
                    <label for="amount">Payment Amount:</label>
                    <input type="number" class="form-control" id="amount" name="amount" required>
                </div>
                <div class="form-group">
                    <label for="paymentMethod">Payment Method:</label>
                    <select class="form-control" id="paymentMethod" name="paymentMethod" required>
                        <option value="" disabled selected>Select a method</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Gcash">Gcash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="receipt">Upload Receipt:</label><br>
                    <input type="file" class="form-control-file" id="receipt" name="receipt" accept=".jpg,.jpeg,.png,.pdf">
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Submit Payment',
        preConfirm: () => {
            const form = document.getElementById('paymentForm') as HTMLFormElement;
            const amount = (form.querySelector('#amount') as HTMLInputElement).value;
            const paymentMethod = (form.querySelector('#paymentMethod') as HTMLSelectElement).value;
            const receiptInput = form.querySelector('#receipt') as HTMLInputElement;

            // Safely access files property
            const receipt = receiptInput?.files?.[0]; // Use optional chaining

            // Perform validation
            if (!amount || !paymentMethod || !receipt) {
                Swal.showValidationMessage('Please fill out all fields');
                return false;
            }

            // Set the values to the component properties
            this.amount_paid = Number(amount);
            this.description = paymentMethod;
            this.selectedFile = receipt; // Store the selected file

            return true; // Return true to proceed with submission
        },
        customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            input: 'custom-swal-input',
            confirmButton: 'custom-swal-button',
            cancelButton: 'custom-swal-button',
            htmlContainer: 'left-align'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            this.onSubmit(); // Call onSubmit when confirmed
        }
    });
}

onSubmit(): void {
    // Validation checks
    if (!this.selectedFile) {
        Swal.fire({
            title: "Error!",
            text: "Please select a proof of payment file before submitting.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    if (!this.amount_paid || this.amount_paid <= 0) {
        Swal.fire({
            title: "Error!",
            text: "Please enter a valid amount paid.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    if (!this.description) {
        Swal.fire({
            title: "Error!",
            text: "Please provide a description.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    const formData = new FormData();
    formData.append('LRN', this.LRN || ''); // Ensure LRN is appended safely
    formData.append('amount_paid', this.amount_paid.toString()); // Append amount_paid as string
    formData.append('proof_payment', this.selectedFile); // Append the selected file
    formData.append('description', this.description); // Append description
    formData.append('date_of_payment', this.date_of_payment); // Ensure date_of_payment is set correctly

    // Call the service to upload payment proof
    this.conn.newPayment(formData).subscribe(
        response => {
            console.log('Upload successful:', response);
            Swal.fire({
                title: "Success!",
                text: "Your payment has been successfully uploaded. Please wait for the DSF approval.",
                icon: "success",
                confirmButtonText: "OK"
            });

            // Reset values after submission
            this.amount_paid = undefined;
            this.description = '';
            this.selectedFile = null; // Reset selected file
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