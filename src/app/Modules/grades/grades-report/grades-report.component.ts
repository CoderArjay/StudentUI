import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ConnectService } from '../../../connect.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-grades-report',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './grades-report.component.html',
  styleUrls: ['./grades-report.component.css']
})
export class GradesReportComponent implements OnInit{
  student: any = {};
studentSubjects: any[] = [];
fname: string = '';
lname: string = '';
contact_no: string = '';
grade_level: string = '';
LRN: string = '';
studentSection: string = '';
currentDate: Date = new Date();
loadingSubjects: boolean = true; // Fixed spelling from loadingSujects to loadingSubjects

isJuniorHigh: boolean = false; // New property to check if the student is in junior high

constructor(private conn: ConnectService, private http: HttpClient) {}

ngOnInit(): void {
    this.retrieveStudentData();
    if (this.LRN) {
        this.fetchStudentReport(this.LRN);
    }
}

retrieveStudentData(): void {
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (student) {
        this.fname = student.fname || '';
        this.lname = student.lname || '';
        this.contact_no = student.contact_no || ''; // Assuming contact_no is stored
        this.grade_level = student.grade_level || '';
        this.LRN = student.LRN || ''; // Assuming LRN is stored
        
        // Determine if the student is in junior high or senior high
        this.isJuniorHigh = parseInt(this.grade_level, 10) >= 7 && parseInt(this.grade_level, 10) <= 10;
    } else {
        console.error('No student data found.');
    }
}

fetchStudentReport(lrn: string): void {
    this.loadingSubjects = true; // Start loading state
    this.http.get<any>(`http://localhost:8000/api/student-report/${lrn}`).subscribe(
      data => {
        console.log('Fetched data:', data); // Log the fetched data
        if (Object.keys(data).length > 0) {
          this.studentSection = data.section_name;

          // Check if subjects are present
          console.log('Subjects:', Object.keys(data)); // Log subjects

          this.studentSubjects = Object.keys(data).map(subject => ({
            subject_name: subject,
            semester: data[subject].semester, // Assuming this field is returned from the API
            grades: this.isJuniorHigh ? [
                Number(data[subject]['First Quarter']?.grade) || 0,
                Number(data[subject]['Second Quarter']?.grade) || 0,
                Number(data[subject]['Third Quarter']?.grade) || 0,
                Number(data[subject]['Fourth Quarter']?.grade) || 0,
            ] : [
                Number(data[subject]['Midterm']?.grade) || 0,
                Number(data[subject]['Final']?.grade) || 0,
            ],
        }));
          this.student.LRN = lrn; // Update LRN in student object
        } else {
          console.warn('No records found for the given LRN.');
        }
        this.loadingSubjects = false; // Set loading to false after data is fetched
      },
      error => {
        console.error('Error fetching student report:', error);
        this.loadingSubjects = false; // Ensure loading state is updated on error
      }
    );
}
}