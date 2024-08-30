import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementComponent } from '../announcement/announcement.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,MatCardModule, MatButtonModule, MatExpansionModule, MatIcon, MatToolbarModule,MatDatepickerModule,
    MatNativeDateModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  selectedDate: Date = new Date();

  upcomingEvents = [];

  // upcomingEvents = [
  //   {
  //     title: 'Team Meeting',
  //     date: new Date('2024-09-01'),
  //     description: 'Discuss project updates and deadlines.',
  //     color: '#ffcccc' // Light red
  //   },
  //   {
  //     title: 'Workshop on Angular',
  //     date: new Date('2024-09-05'),
  //     description: 'An interactive workshop on Angular best practices.',
  //     color: '#ccffcc' // Light green
  //   },
  //   {
  //     title: 'Annual Sports Day',
  //     date: new Date('2024-09-10'),
  //     description: 'A day filled with sports activities and fun.',
  //     color: '#ccccff' // Light blue
  //   },
  //   {
  //     title: 'Guest Lecture',
  //     date: new Date('2024-09-15'),
  //     description: 'A guest lecture by industry experts.',
  //     color: '#ffffcc' // Light yellow
  //   },
  //   // Add more events as needed
  // ];

  onDateChange(event: Date) {
    console.log('Selected date:', event);
  }

  // Example list of joined clubs
  joinedClubs = [
    { name: 'Photography Club', description: 'A club for photography enthusiasts to share and learn.' },
    { name: 'Coding Club', description: 'A group for students interested in programming and software development.' },
    { name: 'Book Club', description: 'A club for book lovers to discuss and share their favorite reads.' },
    { name: 'Music Club', description: 'A place for musicians to collaborate and perform together.' },
    // Add more clubs as needed
  ];

  
  constructor(private dialog: MatDialog) {}

  openDialog(): void{
    const dialogRef = this.dialog.open(AnnouncementComponent, {
      height: '400px',
      width: '600px',
  });
}

}