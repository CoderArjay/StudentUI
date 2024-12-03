import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ConnectService } from '../../../connect.service';
import { HttpClient } from '@angular/common/http';

interface Grades {
  [subject: string]: {
    [period: string]: string; // Assuming grades are strings (e.g., 'A', 'B+')
  };
}

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
  studentSection: string = ''
  currentDate: Date = new Date();

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
    } else {
      console.error('No student data found.');
    }
  }

  fetchStudentReport(lrn: string): void {
    this.http.get<any>(`http://localhost:8000/api/student-report/${lrn}`).subscribe(
        data => {
            console.log('Fetched data:', data); // Log the fetched data
            if (Object.keys(data).length > 0) {
                this.studentSection = data.section_name;

                // Check if subjects are present
                console.log('Subjects:', Object.keys(data)); // Log subjects

                this.studentSubjects = Object.keys(data).map(subject => ({
                    subject_name: subject,
                    grades: [
                        Number(data[subject]['1st Quarter']?.grade) || 0,
                        Number(data[subject]['2nd Quarter']?.grade) || 0,
                        Number(data[subject]['3rd Quarter']?.grade) || 0,
                        Number(data[subject]['4th Quarter']?.grade) || 0,
                    ],
                }));
                this.student.LRN = lrn; // Update LRN in student object
            } else {
                console.warn('No records found for the given LRN.');
            }
        },
        error => {
            console.error('Error fetching student report:', error);
        }
    );
}
}