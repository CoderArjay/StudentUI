import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectService } from '../../../connect.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable ,of} from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

interface Class {
  room: string;
  subject_name: string;
  lname: string;
  fname: string;
  time: string;
  schedule: string;
}

interface Announcement {
  admin_name: string;
  created_at: Date; // Adjust based on your actual date format
  title: string;
  announcement: string;
  subject_name: string;
}

interface Message {
  content: string;
  timestamp: Date; // Adjust based on your actual date format
  isRead: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,MatTabsModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  classes: Class[] = [];
  announcements: Announcement[] = [];
  messages: Message[] = [];
  fname: string = '';
  lname: string = '';
  grade_level: string = '';
  lrn!: string;
  errorMessage: string = '';
  uid: any;
  currentTime!: string;
  private intervalId: any;

  loadingClasses: boolean = true; // Loading state for classes tab
  loadingAnnouncements: boolean = true; // Loading state for announcements tab
  loadingMessages: boolean = true; // Loading state for messages tab

  constructor(private http: HttpClient, private conn: ConnectService) {}

  ngOnInit(): void {
    this.updateCurrentTime();
    this.intervalId = setInterval(() => {
      this.updateCurrentTime(); 
      this.fetchAnnouncements();
    }, 1000); 

    this.uid = localStorage.getItem('LRN');
    this.retrieveStudentData();
    
    // Load data
    this.loadClasses();
    this.loadAnnouncements();
    this.loadMessages();
    
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

getClass(lrn: string): void {
    this.conn.getClass(lrn).subscribe({
      next: (data) => {
        console.log('Fetched classes:', data); // Log fetched data
        this.classes = data.classes; // Adjust based on your API response structure
        this.loadingClasses = false; // Set loading to false after data is fetched
      },
      error: (error) => {
        console.error('Error fetching classes:', error);
        this.errorMessage = 'Failed to retrieve classes.';
        this.loadingClasses = false; // Ensure loading state is updated on error
      }
    });
}

fetchAnnouncements(): void {
    this.http.get<Announcement[]>('http://localhost:8000/api/announcement').subscribe({
      next: (data) => {
        console.log('Fetched announcements:', data); // Log fetched data
        this.announcements = data; // Assign fetched data to announcements array
        this.loadingAnnouncements = false; // Set loading to false after data is fetched
      },
      error: (error) => {
        console.error('Error fetching announcements', error);
        this.loadingAnnouncements = false; // Ensure loading state is updated on error
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
        this.loadingMessages = false; // Set loading to false after data is fetched
      },
      error: (error) => {
        console.error("Error fetching messages:", error);
        this.errorMessage = 'Failed to retrieve messages.';
        this.loadingMessages = false; // Ensure loading state is updated on error
      }
    });
}

truncateMessage(message: string, limit: number = 50): string {
    if (!message) return '';
    return message.length <= limit ? message : message.substring(0, limit) + '...';
}

loadClasses() {
  this.loadingClasses = true; // Start loading state
  // Fetch classes using the getClass method instead of simulating an API call
}

loadAnnouncements() {
  this.loadingAnnouncements = true; // Start loading state
}

loadMessages() {
  this.loadingMessages = true; // Start loading state
}
}