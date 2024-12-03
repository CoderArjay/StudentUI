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

@Component({
  selector: 'app-financial-statement',
  standalone: true,
  imports: [ RouterModule, 
    MatToolbarModule, MatButtonModule, 
    MatIconModule, MatSidenavModule, MatBadgeModule, 
    MatMenuModule, MatListModule, CommonModule],
  templateUrl: './financial-statement.component.html',
  styleUrl: './financial-statement.component.css'
})
export class FinancialStatementComponent implements OnInit {
  fname: string = '';
  lname: string = '';
  grade_level: string = '';
  currentDate = new Date();
  payments: any[] = [];
  documents: any[] = [];
  LRN: string = '';
  


  constructor(private route: ActivatedRoute, private conn: ConnectService) {}

  ngOnInit(): void {
    this.retrieveStudentData();
    const LRN = this.route.snapshot.paramMap.get('LRN')!;
      this.fetchFinancialStatement(LRN);
  }

  retrieveStudentData(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (student) {
      this.fname = student.fname || '';
      this.lname = student.lname || '';
      this.grade_level = student.grade_level || '';
      this.LRN = student.LRN || ''; // Assuming LRN is stored
    } else {
      console.error('No student data found.');
    }
  }


  fetchFinancialStatement(LRN: string): void {
    this.conn.getFinancialStatement(LRN).subscribe(
      response => {
        this.payments = response.payments;
        this.documents = response.documents;
      },
      error => {
        console.error('Error fetching financial statement:', error);
      }
    );
  }
}
