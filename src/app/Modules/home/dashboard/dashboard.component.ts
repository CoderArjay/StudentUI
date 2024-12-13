import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectService } from '../../../connect.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable ,of} from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementComponent } from '../announcement/announcement.component';

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

export interface Message {
  admin_id: number;
  message_id: number;
  message_reciever: number;
  message_sender: number;
  message: string; // This is the actual message content
  message_date: string;
  isRead: boolean;
  created_at: string;
  updated_at: string;
  fname: string; // Admin's first name
  lname: string; // Admin's last name
  admin_pic?: string | null; // Optional admin picture URL
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
  fname: string = ''; //for student
  lname: string = '';//for student
  grade_level: string = '';//for student
  lrn!: string;
  errorMessage: string = '';
  uid: string = localStorage.getItem('LRN') || '';
  currentTime!: string;
  private intervalId: any;

  loadingClasses: boolean = true; // Loading state for classes tab
  loadingAnnouncements: boolean = true; // Loading state for announcements tab
  loadingMessages: boolean = true; // Loading state for messages tab

  constructor(private http: HttpClient, private conn: ConnectService,private dialog: MatDialog, private route: Router) {}

  ngOnInit(): void {
    this.updateCurrentTime();
    this.intervalId = setInterval(() => {
      this.updateCurrentTime(); 
      this.fetchAnnouncements();
    }, 10000); 

    // this.uid = localStorage.getItem('LRN');
    this.retrieveStudentData();
    this.getMessages();
    
    // Load data
    this.loadAnnouncements();
    
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
  if (!this.uid) {
    this.errorMessage = 'No UID found. Please try again later.';
    return; 
  }
  
  // Fetch messages only for conversations involving the logged-in student
  this.conn.getLatestMessages(this.uid).subscribe({
    next: (result) => {
      // Filter messages to include only those where the logged-in student is involved
      this.messages = result.filter(message => 
        message.message_reciever === this.uid || message.message_sender === this.uid
      );
    },
    error: () => {
      this.errorMessage = 'Failed to retrieve messages.';
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


openDialog(announcement: Announcement): void {
  const dialogRef = this.dialog.open(AnnouncementComponent, {
    width: '700px',
    data: announcement // Pass the selected announcement data to the dialog
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Handle any additional logic after closing the dialog if needed
  });
}

truncateText(text: string, length: number): string {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}


navigateToMessage(adminId: any, receiverId: any): void {
  console.log("Navigating to conversation with Admin ID:", adminId, "and Receiver ID:", receiverId);
  
  // Fetch the conversation details if necessary
  this.conn.getConvo(adminId, receiverId).subscribe((result: any) => {
    console.log(result); // Check if result is as expected
    
    // Navigate to the specific message page using Receiver ID
    this.route.navigate(['/main/message-page/message-page/messages/view', receiverId]);
  });
}

deleteMessage(index: number): void {
  // Remove the message from the messages array
  this.messages.splice(index, 1);
  
  // Optionally, you can also call a service method here to delete it from the backend
  // this.conn.deleteMessage(messageId).subscribe(...);
  
  console.log(`Deleted message at index ${index}`);
}
}