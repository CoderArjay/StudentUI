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

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, MatListModule, RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Default, // Changed to Default
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  fname: string = '';
  lname: string = '';
  grade_level: string = '';
  LRN: string = '';
  tuitionDetails: any = {};
  selectedFile: File | null = null;

  constructor(private conn: ConnectService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.retrievePaymentData(); // Retrieve data on init
    if (this.LRN) {
      const LRN = parseInt(this.LRN, 10);

      this.conn.getTuitionDetails(LRN).subscribe((response: any) => {
        this.tuitionDetails = response;
        this.formatTuitionDetails();
        // this.conn.detectChanges(); // Manually trigger change detection
      });
    } else {
      console.error('No LRN found in student data.');
    }
  }

  retrievePaymentData(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (student) {
      this.fname = student.fname || '';
      this.lname = student.lname || '';
      this.grade_level = student.grade_level || ''; // Assuming grade_level is stored
      this.LRN = student.LRN || ''; // Assuming LRN is stored
    } else {
      console.error('No payment data found.');
    }
  }

  formatTuitionDetails(): void {
    if (this.tuitionDetails) {
      if (this.tuitionDetails.tuition) {
        this.tuitionDetails.tuition = parseFloat(this.tuitionDetails.tuition.replace(',', '')).toFixed(2);
      }
      if (this.tuitionDetails.general) {
        this.tuitionDetails.general = parseFloat(this.tuitionDetails.general.replace(',', '')).toFixed(2);
      }
      if (this.tuitionDetails.esc) {
        this.tuitionDetails.esc = parseFloat(this.tuitionDetails.esc.replace(',', '')).toFixed(2);
      }
      if (this.tuitionDetails.subsidy) {
        this.tuitionDetails.subsidy = parseFloat(this.tuitionDetails.subsidy.replace(',', '')).toFixed(2);
      }
      if (this.tuitionDetails.req_downpayment) {
        this.tuitionDetails.req_downpayment = parseFloat(this.tuitionDetails.req_downpayment.replace(',', '')).toFixed(2);
      }
    } else {
      console.error('No tuition details found.');
    }
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('LRN', this.LRN);
      formData.append('proof_payment', this.selectedFile);
      
      this.conn.uploadPaymentProof(formData).subscribe(response => {
        console.log('Upload successful', response);
        // this.router.navigate(['/register/dsf-approval']); // Navigate after successful update/

        // Handle successful upload...
      }, error => {
        console.error('Upload failed', error);
        // Handle error...
      });
    }
  }

}