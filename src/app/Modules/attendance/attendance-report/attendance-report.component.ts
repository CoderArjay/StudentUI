import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { ConnectService } from '../../../connect.service';

// Define interfaces for AttendanceRecord, Subject, and AttendanceData
interface AttendanceRecord {
  subject_name: string;
  date: string; // Assuming date is in string format (e.g., 'YYYY-MM-DD')
  status: string; // Attendance status
}

interface Subject {
  subject_name: string;
}

interface AttendanceData {
  subject_name: string;
  dates: { [key: string]: number }; // Store days (1-31)
  attendance: { [key: string]: string }; // Attendance status for each day
}

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
  attendanceRecords: AttendanceRecord[] = []; 
  subjects: Subject[] = []; 
  calendarData: AttendanceData[] = []; 
  today: Date; 

  constructor(private conn: ConnectService) {
    this.today = new Date(); 
  }

  ngOnInit(): void {
    const studentData = JSON.parse(localStorage.getItem('student') || '{}');
    
    if (studentData?.LRN) {
      this.LRN = studentData.LRN; 
      
      this.conn.getAttendanceReport(this.LRN).subscribe(
        (response) => {
          this.attendanceRecords = response.attendanceRecords; 
          this.subjects = response.subjects; 
          this.createCalendar(); 
        },
        (error) => {
          console.error('Error fetching attendance data:', error);
        }
      );
    }
  }

  getCurrentWeekDates(): { start: Date; end: Date } {
    const startOfWeek = new Date(this.today);
    startOfWeek.setDate(this.today.getDate() - this.today.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Friday
    return { start: startOfWeek, end: endOfWeek };
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

getDayNameByDate(date: string): string | null {
  const day = new Date(date).getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[day] || null; // Return the day name or null if not found
}
}
