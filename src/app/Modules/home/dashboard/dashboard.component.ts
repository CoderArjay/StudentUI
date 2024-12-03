import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectService } from '../../../connect.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,MatTabsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  classes: any[] = [];
  announcements: any[] = [];
  selectedAnnouncement: any = null;
  fname: string = '';
  lname: string = '';
  grade_level: string = '';
  lrn!: string;
  messages: any[] = [];
  errorMessage: string = '';
  profileImages: { [key: string]: string } = {};
  uid: any;
  inputClicked: boolean = false;
  stupar: any;
  keyword: string = '';
  currentTime!: string;
  private intervalId: any;

  constructor(private http: HttpClient, private conn: ConnectService) {}

  ngOnInit(): void {
    this.updateCurrentTime();
    this.intervalId = setInterval(() => {
      this.updateCurrentTime(); 
      this.fetchAnnouncements();
    }, 1000); 
    this.uid = localStorage.getItem('LRN');
    this.retrieveStudentData();
    this.fetchAnnouncements();
    this.getMessages(); 
    

    if (this.lrn) {
      this.getClass(this.lrn);
    }
  }
  
  updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleString(); // This will give you a string with date and time
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); 
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString(); // Format the time as needed
  }
  
  getClass(lrn: string): void {
    this.conn.getClass(lrn).subscribe({
      next: (data) => {
        console.log('Fetched classes:', data); // Log fetched data
        this.classes = data.classes; // Adjust based on your API response structure
      },
      error: (error) => {
        console.error('Error fetching classes:', error);
        this.errorMessage = 'Failed to retrieve classes.';
      }
    });
  }

  retrieveStudentData(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    
    if (student && Object.keys(student).length > 0) {
        this.fname = student.fname || '';
        this.lname = student.lname || '';
        this.lrn = student.LRN || null; // Retrieve LRN
        
        // Accessing grade_level from enrollment object
        if (student.enrollment) {
            this.grade_level = student.enrollment.grade_level || ''; // Retrieve grade level from enrollment
        } else {
            console.error('Enrollment data not found.');
        }
    } else {
        console.error('No student data found.');
    }
}

  fetchAnnouncements(): void {
    this.http.get<any[]>('http://localhost:8000/api/announcement').subscribe({
      next: (data) => {
        console.log('Fetched announcements:', data); // Log fetched data
        this.announcements = data; // Assign fetched data to announcements array
      },
      error: (error) => {
        console.error('Error fetching announcements', error);
      }
    });
  }

  

  getMessages(): void {
    console.log("uid (student LRN):", this.uid);
    if (!this.uid) {
      console.error("No UID found for fetching messages.");
      return; // Exit early if UID is not available
    }
    
    this.conn.getMessages(this.uid).subscribe({
      next: (result) => {
        console.log("Fetched messages:", result); // Log fetched messages
        // this.messages = result; // Store received messages
      },
      error: (error) => {
        console.error("Error fetching messages:", error);
        this.errorMessage = 'Failed to retrieve messages.';
      }
    });
  }

  truncateMessage(message: string, limit: number = 50): string {
    if (!message) return '';
    return message.length <= limit ? message : message.substring(0, limit) + '...';
  }

  
}