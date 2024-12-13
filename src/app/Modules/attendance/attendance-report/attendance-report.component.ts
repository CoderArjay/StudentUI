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
export class AttendanceReportComponent implements OnInit, OnDestroy {
  LRN: string = '';
    today: Date;
    attendanceRecords: any[] = [];
    subjects: any[] = [];
    calendarData: any[] = [];
    currentTime!: string;
    private intervalId: any;
    loadingAttendance: boolean = true; // Loading state for attendance
    currentWeekStart: Date; // Store the start of the current week
    currentWeekEnd: Date; // Store the end of the current week
    selectedTab: number = 1; // Default to First Semester
    selectedSemester: number | null = null; // Track selected semester (1, 2, or null)

    constructor(private conn: ConnectService) {
        this.today = new Date();
        const currentWeekDates = this.getCurrentWeekDates();
        this.currentWeekStart = currentWeekDates.start; 
        this.currentWeekEnd = currentWeekDates.end;
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
        if (showLoading) {
            this.loadingAttendance = true; // Show loading spinner only on initial fetch
        }

        this.conn.getAttendanceReport(this.LRN, this.currentWeekStart, this.currentWeekEnd).subscribe(
            (response) => {
                console.log('Fetched attendance records:', response.attendanceRecords); // Debugging line
                this.attendanceRecords = response.attendanceRecords; // Fetch attendance records
                this.subjects = response.subjects; // Fetch subjects
                this.createCalendar(); // Create calendar data based on fetched records
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

    getCurrentWeekDates(): { start: Date; end: Date } {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set to Monday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 4); // Set to Friday
        return { start: startOfWeek, end: endOfWeek };
    }

    getCurrentWeek(): string {
        return `${this.currentWeekStart.toLocaleDateString()} - ${this.currentWeekEnd.toLocaleDateString()}`;
    }

    createCalendar(): void {
        const attendanceStatus: { [key: string]: string } = {};
        
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        let dayCount = 0;
        
        const currentWeekDates: { [key: string]: string } = {}; // To store the date of the month
        
        // Initialize current week dates dynamically based on the start and end of the week
        for (let date = new Date(this.currentWeekStart); date <= this.currentWeekEnd; date.setDate(date.getDate() + 1)) {
            if (dayCount < daysOfWeek.length) {
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`; // MM/DD/YYYY
                currentWeekDates[daysOfWeek[dayCount]] = formattedDate; // Store exact date
                attendanceStatus[daysOfWeek[dayCount]] = ''; // Default status as empty (N/A)
                dayCount++;
            }
        }

        // Initialize calendar data with attendance records
        this.calendarData = this.subjects.map(subject => {
            const attendanceForSubject = { ...attendanceStatus }; // Clone the attendance status

            // Check attendance records for this subject
            this.attendanceRecords.forEach(record => {
                if (record.subject_name === subject.subject_name) {
                    const recordDate = new Date(record.date); // Convert attendance record date to Date object
                    const recordFormattedDate = `${recordDate.getMonth() + 1}/${recordDate.getDate()}/${recordDate.getFullYear()}`; // MM/DD/YYYY

                    // Check which day of the week this record belongs to
                    daysOfWeek.forEach((day) => {
                        if (currentWeekDates[day] === recordFormattedDate) {
                            attendanceForSubject[day] = record.status; // Set the status for the correct day
                        }
                    });
                }
            });

            return {
                subject_name: subject.subject_name,
                semester: subject.semester, // Ensure subject has a semester property (1, 2, or null)
                dates: currentWeekDates,
                attendance: attendanceForSubject,
            };
        });

        // Filter calendarData by selected semester
        if (this.selectedSemester !== null) {
            this.calendarData = this.calendarData.filter(subject => subject.semester === this.selectedSemester);
        }
    }

    navigateToPreviousWeek(): void {
        // Adjust the week start and end for the previous week
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
        this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() - 7);

        // Fetch the attendance for the previous week
        this.fetchAttendance();
    }

    navigateToNextWeek(): void {
        // Adjust the week start and end for the next week
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
        this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 7);

        // Fetch the attendance for the next week
        this.fetchAttendance();
    }

    // Handle semester tab selection
    selectTab(tab: number): void {
        this.selectedTab = tab;
        this.selectedSemester = tab; // Set the selected semester based on the tab clicked
        this.createCalendar(); // Recreate calendar data based on the selected semester
    }

    // Check if any subject is available for the given semester
    hasSemester(semester: number): boolean {
        return this.subjects.some(subject => subject.semester === semester);
    }

    // Check if any subject is available without a semester
    hasNullSemester(): boolean {
        return this.subjects.some(subject => subject.semester === null);
    }
}
