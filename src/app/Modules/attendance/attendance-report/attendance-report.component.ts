import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { ConnectService } from '../../../connect.service';

@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatListModule,
    MatSidenavModule,
    MatTableModule 
  ],
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent implements OnInit {
  LRN: string = '';
  today: Date;
  attendanceRecords: any[] = [];
  subjects: any[] = [];
  calendarData: any[] = [];
  currentTime!: string;
  private intervalId: any;


  constructor(private conn: ConnectService) {
    this.today = new Date();
  }

  ngOnInit(): void {
    const studentData = JSON.parse(localStorage.getItem('student') || '{}');
    this.updateCurrentTime(); // Get the current date
   
    if (studentData?.LRN) {
      this.LRN = studentData.LRN;

      // Fetch attendance report for the first time
      this.fetchAttendance();

      // Set an interval to fetch attendance records every 30 seconds (adjust as needed)
      this.intervalId = setInterval(() => {
          this.fetchAttendance();
      }, 1000); 
  }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); 
  }

  fetchAttendance(): void {
    // Fetch attendance report
    this.conn.getAttendanceReport(this.LRN).subscribe(
        (response) => {
            this.attendanceRecords = response.attendanceRecords; // Fetch attendance records
            this.subjects = response.subjects; // Fetch subjects
            this.createCalendar(); // Create calendar data
        },
        (error) => {
            console.error('Error fetching attendance data:', error);
        }
    );
}

  updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleString(); // This will give you a string with date and time
  }

  getCurrentWeek(): string {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set to Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Set to Friday

    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
  }

  createCalendar(): void {
    const currentWeekDates: { [key: string]: number } = {}; // Store days (1-31)
    const attendanceStatus: { [key: string]: string } = {};
    const { start, end } = this.getCurrentWeekDates();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    let dayCount = 0;

    // Populate current week dates
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      if (dayCount < daysOfWeek.length) {
        currentWeekDates[daysOfWeek[dayCount]] = date.getDate(); // Store the day of the month (1-31)
        attendanceStatus[daysOfWeek[dayCount]] = ''; // Default to N/A
        dayCount++;
      }
    }

    // Initialize calendar data with attendance records
    this.calendarData = this.subjects.map(subject => {
      const attendanceForSubject = { ...attendanceStatus }; // Clone the attendance status

      // Check attendance records for this subject
      this.attendanceRecords.forEach(record => {
        if (record.subject_name === subject.subject_name) {
          const dayName = this.getDayNameByDate(record.date); // Get the day name
          if (dayName) {
            attendanceForSubject[dayName] = record.status; // Assign status
          }
        }
      });

      return {
        subject_name: subject.subject_name,
        dates: currentWeekDates,
        attendance: attendanceForSubject
      };
    });
  }

  getCurrentWeekDates(): { start: Date; end: Date } {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set to Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Set to Friday
    return { start: startOfWeek, end: endOfWeek };
  }

  getDayNameByDate(dateString: string): string | null {
    const date = new Date(dateString);
    const dayIndex = date.getDay(); // Sunday is 0, Saturday is 6
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return dayNames[dayIndex + 1] || null; // Return the day name or null if not found (shifted to align with Monday)
  }
}
