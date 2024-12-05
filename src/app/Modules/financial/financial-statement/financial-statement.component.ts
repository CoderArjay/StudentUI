import { Component, OnInit } from '@angular/core';
import { ConnectService } from '../../../connect.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CustomSidenavComponent } from '../../../custom-sidenav/custom-sidenav.component';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-financial-statement',
  standalone: true,
  imports: [ RouterModule, 
    MatToolbarModule, MatButtonModule, 
    MatIconModule, MatSidenavModule, MatBadgeModule, 
    MatMenuModule, MatListModule, CommonModule,MatTabsModule],
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

  constructor(private conn: ConnectService) {}

  ngOnInit(): void {
    this.retrieveStudentData();

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
}