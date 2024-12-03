import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
// import { Observable } from 'rxjs';

import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { ConnectService } from '../../../connect.service';
import { HttpClient } from '@angular/common/http';
import { SearchFilterPipe } from "../../../search.pipe";

interface Klass {
  room: string;
  subject_name: string;
  lname: string;
  fname: string;
  time: string;
  schedule: string;
}

interface ClassResponse {
  enrollment: any; 
  klasses: Klass[];
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatToolbarModule, MatDatepickerModule,
    MatNativeDateModule, CommonModule, MatBottomSheetModule, MatListModule, MatExpansionModule, MatTabsModule, SearchFilterPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  classes: any[] = [];
  announcements: any[] = [];
  selectedAnnouncement: any = null;
  fname: string = '';
  lname: string = '';
  lrn: number | null = null;
  loadingClasses: boolean = false;
  messages: any[] = []; // Initialize as an array
  errorMessage: string = '';
  profileImages: { [key: string]: string } = {};
  uid: any;
  inputClicked: boolean = false;
  stupar: any;
  keyword: string = '';

  truncateMessage(message: string, limit: number = 50): string {
    if (!message) return '';
    return message.length <= limit ? message : message.substring(0, limit) + '...';
  }

  constructor(
    private http: HttpClient,
    private conn: ConnectService
  ) {}

  ngOnInit(): void {
    this.uid = localStorage.getItem('LRN');
    this.fetchAnnouncements();
    this.retrieveStudentData();
    // this.fetchLatestMessages();
    this.getMessages(); // Fetch messages for this student
    

    if (this.lrn) {
      this.getClass(this.lrn).subscribe({
        next: (data: ClassResponse) => {
          this.classes = data.klasses;
          this.loadingClasses = false;
        },
        error: (error: any) => {
          console.error('Error fetching classes:', error);
          this.errorMessage = 'Failed to retrieve classes.';
          this.loadingClasses = false;
        }
      });
    }
  }

  getClass(LRN: number): any {
    return this.http.get<ClassResponse>(`http://localhost:8000/api/student/classes/${LRN}`);
  }

  retrieveStudentData(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    if (student) {
      this.fname = student.fname || '';
      this.lname = student.lname || '';
      this.lrn = student.LRN || null;
    } else {
      console.error('No student data found.');
    }
  }

  fetchAnnouncements(): void {
    this.http.get<any[]>('http://localhost:8000/api/announcement').subscribe({
      next: (data: any[]) => {
        this.announcements = data;
      },
      error: (error: any) => {
        console.error('Error fetching announcements', error);
      }
    });
  }

  selectAnnouncement(announcement: any): void {
    this.selectedAnnouncement = announcement;
  }

  // fetchLatestMessages(): void {
  //   this.conn.getLatestMessages().subscribe(
  //     response => {
  //       this.latestMessages = response; // Store the response in the latestMessages array
  //       console.log('Latest Messages:', this.latestMessages); // Log for debugging
  //     },
  //     error => {
  //       console.error('Error fetching latest messages:', error);
  //     }
  //   );
  // }

  getMessages() {
    console.log("uid (student LRN):", this.uid);
    this.conn.getMessages(this.uid).subscribe((result: any) => {
      console.log("result list:", result);
      this.messages = result; // Store received messages
    });
  }

}