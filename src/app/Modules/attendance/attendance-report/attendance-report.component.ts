import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

interface AttendanceRecord {
  date: Date;
  status: string;
}

interface Subject {
  name: string;
  attendanceRecords: AttendanceRecord[];
}

@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatListModule,
    MatSidenavModule
  ],
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent {
  subjects: Subject[] = [
    {
      name: 'Mathematics',
      attendanceRecords: [
        { date: new Date('2024-08-01'), status: 'Present' },
        { date: new Date('2024-08-15'), status: 'Absent' },
      ]
    },
    {
      name: 'English',
      attendanceRecords: [
        { date: new Date('2024-08-04'), status: 'Present' },
        { date: new Date('2024-08-18'), status: 'Absent' },
      ]
    },
    {
      name: 'Science',
      attendanceRecords: [
        { date: new Date('2024-08-02'), status: 'Present' },
        { date: new Date('2024-08-14'), status: 'Present' },
      ]
    },
    {
      name: 'MAPEH',
      attendanceRecords: [
        { date: new Date('2024-08-03'), status: 'Absent' },
        { date: new Date('2024-08-16'), status: 'Present' },
      ]
    },
    {
      name: 'Filipino',
      attendanceRecords: [
        { date: new Date('2024-08-05'), status: 'Present' },
        { date: new Date('2024-08-20'), status: 'Absent' },
      ]
    },
    {
      name: 'TLE',
      attendanceRecords: [
        { date: new Date('2024-08-06'), status: 'Present' },
        { date: new Date('2024-08-21'), status: 'Absent' },
      ]
    }
  ];

  selectedSubject!: Subject; // Will be set based on user selection
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  // Initialize current date
  currentDate: Date = new Date(); // This will hold the current date

  constructor() {
    // Initialize with the first subject or any default subject
    this.selectedSubject = this.subjects[0];
  }

  selectSubject(subjectName: string) {
    this.selectedSubject = this.subjects.find(subject => subject.name === subjectName)!;
    // Optionally, you can add logic here to reset or update any other state as needed
  }

  getCalendarDates() {
    const startOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const dates = [];

    // Fill in the days of the month
    for (let day = startOfMonth.getDate(); day <= endOfMonth.getDate(); day++) {
      const currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      // Only add weekdays (Monday to Friday)
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
        dates.push(currentDate);
      }
    }

    return dates;
  }

  getStatus(date: Date) {
    const record = this.selectedSubject.attendanceRecords.find(record => record.date.toDateString() === date.toDateString());
    return record ? record.status : 'N/A'; // Return 'N/A' if no record found
  }

  getStatusClass(date: Date) {
    const record = this.selectedSubject.attendanceRecords.find(record => record.date.toDateString() === date.toDateString());
    return record ? (record.status === 'Present' ? 'present' : 'absent') : 'no-record'; // Class based on status
  }
}