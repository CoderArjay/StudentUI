import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class AttendanceReportComponent implements OnInit ,OnDestroy {
  LRN: string = '';
  today: Date;
  attendanceRecords: any[] = [];
  subjects: any[] = [];
  calendarData: any[] = [];
  currentTime!: string;
  private intervalId: any;
  loadingAttendance: boolean = true; // Loading state for attendance

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
          this.fetchAttendance(false); // Call fetchAttendance without showing loading spinner
      }, 30000); // Adjusted to 30 seconds for better performance
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); 
  }

  fetchAttendance(showLoading: boolean = true): void {
    // Fetch attendance report
    if (showLoading) {
      this.loadingAttendance = true; // Show loading spinner only on initial fetch
    }
    
    this.conn.getAttendanceReport(this.LRN).subscribe(
        (response) => {
            this.attendanceRecords = response.attendanceRecords; // Fetch attendance records
            this.subjects = response.subjects; // Fetch subjects
            this.createCalendar(); // Create calendar data
            if (showLoading) {
              this.loadingAttendance = false; // Hide loading spinner after data is fetched
            }
        },
        (error) => {
            console.error('Error fetching attendance data:', error);
            if (showLoading) {
              this.loadingAttendance = false; // Ensure loading state is updated on error
            }
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

    // Define options for formatting
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    return `${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', options)}`;
}

  createCalendar(): void {
    const currentWeekDates: { [key: string]: string } = {}; // Store days in "Day Date" format
    const attendanceStatus: { [key: string]: string } = {};
    const { start, end } = this.getCurrentWeekDates();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    let dayCount = 0;

    // Populate current week dates
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      if (dayCount < daysOfWeek.length) {
        // Store the day of the week with its corresponding date
        currentWeekDates[daysOfWeek[dayCount]] = `${daysOfWeek[dayCount]} ${date.getDate()}`; 
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
    const dayNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    return dayNames[dayIndex + 1] || null; // Return the day name or null if not found (shifted to align with Monday)
  }
}
