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
  loadingSubjects: boolean = true;

  selectedTab: number = 1; // Default to first semester

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
      this.contact_no = student.contact_no || '';
      this.grade_level = student.grade_level || '';
      this.LRN = student.LRN || '';
    } else {
      console.error('No student data found.');
    }
  }

  fetchStudentReport(lrn: string): void {
    this.loadingSubjects = true;
    this.http.get<any>(`http://localhost:8000/api/student-report/${lrn}`).subscribe(
      data => {
        console.log('Fetched data:', data);
        if (data.length > 0) {
          this.studentSection = data[0].section_name; // Assuming section_name is part of the response

          // Process the fetched data into a structured format
          this.studentSubjects = data.map((grade: { subject_name: any; semester: any; Midterm: any; Final: any; First_Quarter: any; Second_Quarter: any; Third_Quarter: any; Fourth_Quarter: any; }) => ({
            subject_name: grade.subject_name,
            semester: grade.semester,
            Midterm: grade.Midterm || '-' ,
            Final: grade.Final || '-',
            First_Quarter: grade.First_Quarter || '-',
            Second_Quarter: grade.Second_Quarter || '-',
            Third_Quarter: grade.Third_Quarter || '-',
            Fourth_Quarter: grade.Fourth_Quarter || '-',
          }));
          this.student.LRN = lrn;
        } else {
          console.warn('No records found for the given LRN.');
        }
        this.loadingSubjects = false;
      },
      error => {
        console.error('Error fetching student report:', error);
        this.loadingSubjects = false;
      }
    );
  }

  hasSemester(semester: number): boolean {
    return this.studentSubjects.some(grade => grade.semester === semester);
  }

  hasNullSemester(): boolean {
    return this.studentSubjects.some(grade => grade.semester === null);
  }

  selectTab(tab: number): void {
    this.selectedTab = tab; // Set the selected tab
  }
}