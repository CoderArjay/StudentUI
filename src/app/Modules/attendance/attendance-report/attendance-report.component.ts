import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
    MatDatepickerModule,
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent {
  months = [
    { value: new Date(2024, 0), viewValue: 'January' },
    { value: new Date(2024, 1), viewValue: 'February' },
    { value: new Date(2024, 2), viewValue: 'March' },
    { value: new Date(2024, 3), viewValue: 'April' },
    { value: new Date(2024, 4), viewValue: 'May' },
    { value: new Date(2024, 5), viewValue: 'June' },
    { value: new Date(2024, 6), viewValue: 'July' },
    { value: new Date(2024, 7), viewValue: 'August' },
    { value: new Date(2024, 8), viewValue: 'September' },
    { value: new Date(2024, 9), viewValue: 'October' },
    { value: new Date(2024, 10), viewValue: 'November' },
    { value: new Date(2024, 11), viewValue: 'December' },
  ];

  subjects: Subject[] = [
    {
      name: 'Mathematics',
      attendanceRecords: [
        { date: new Date('2024-08-01'), status: 'Present' },
        { date: new Date('2024-08-15'), status: 'Absent' },
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
      name: 'History',
      attendanceRecords: [
        { date: new Date('2024-08-03'), status: 'Absent' },
        { date: new Date('2024-08-16'), status: 'Present' },
      ]
    },
    {
      name: 'English',
      attendanceRecords: [
        { date: new Date('2024-08-03'), status: 'Absent' },
        { date: new Date('2024-08-16'), status: 'Present' },
      ]
    },
    {
      name: 'TLE',
      attendanceRecords: [
        { date: new Date('2024-08-03'), status: 'Absent' },
        { date: new Date('2024-08-16'), status: 'Present' },
      ]
    },
  ];

  selectedSubject: Subject = this.subjects[0];
  selectedMonth: any = this.months[7]; // Default to August

  days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  getCalendarDates() {
    const startOfMonth = new Date(this.selectedMonth.value.getFullYear(), this.selectedMonth.value.getMonth(), 1);
    const endOfMonth = new Date(this.selectedMonth.value.getFullYear(), this.selectedMonth.value.getMonth() + 1, 0);
    const dates = [];

    // Fill in the days of the month
    for (let day = startOfMonth.getDate(); day <= endOfMonth.getDate(); day++) {
      const currentDate = new Date(this.selectedMonth.value.getFullYear(), this.selectedMonth.value.getMonth(), day);
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

  onSubjectChange() {
    // Update the calendar based on the selected subject
  }

  onMonthChange() {
    // Update the calendar based on the selected month
  }
}