import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { CommonModule } from '@angular/common';

// Define the Announcement interface
export interface Announcement {
    admin_name: string;     // Name of the admin who made the announcement
    created_at: string;     // Date when the announcement was created
    subject_name: string;    // Subject associated with the announcement
    title: string;          // Title of the announcement
    announcement: string;   // The content of the announcement
}

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatDialogModule], // Include necessary Angular Material modules
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementComponent implements OnInit {
  
  constructor(
    public dialogRef: MatDialogRef<AnnouncementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement // Injecting the announcement data
  ) {}

  ngOnInit(): void {
    console.log('Received announcement data:', this.data); // Log received data for debugging
  }

  closeDialog(): void {
    this.dialogRef.close(); // Method to close the dialog
  }
}