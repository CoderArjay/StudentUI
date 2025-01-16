import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, KeyValuePipe  } from '@angular/common';
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
            Midterm: grade.Midterm || '-',
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

  // Calculate the average for quarterly grades
  calculateAverage(grade1: number, grade2: number, grade3: number, grade4: number): number {
    const grades = [grade1, grade2, grade3, grade4];
    const validGrades = grades.filter(grade => grade >= 60 && grade <= 99);
    return validGrades.length > 0 
      ? this.roundCustom(validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length)
      : 0;
  }

  // Custom rounding method
  roundCustom(value: number): number {
    if (typeof value !== 'number') {
      return 0; // Return 0 for non-numeric values
    }
    const integerPart = Math.floor(value);
    const decimalPart = value - integerPart;
    return decimalPart < 0.5 ? integerPart : integerPart + 1; // Custom rounding logic
  }

  // Final grade calculation for semester-based (Midterm + Final)
  calculateFinalGrade(grade1: number, grade2: number): number {
    const grades = [grade1, grade2];
    const validGrades = grades.filter(grade => grade >= 60 && grade <= 99);
    return validGrades.length > 0 
      ? this.roundCustom(validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length)
      : 0;
  }

  // General average based on semester (Midterm and Final)
  calculateGeneralAveragee(): number {
    const averages = this.studentSubjects.filter(grade => grade.semester !== null)
      .map(grade => this.calculateFinalGrade(grade['Midterm'], grade['Final']))
      .filter(avg => avg > 0);

    const total = averages.reduce((sum, avg) => sum + avg, 0);
    return averages.length > 0 ? this.roundCustom(total / averages.length) : 0;
  }

  // General average based on quarterly grades
  calculateGeneralAverage(): number {
    const averages = this.studentSubjects.filter(grade => grade.semester === null)
      .map(grade => this.calculateAverage(grade['First_Quarter'], grade['Second_Quarter'], grade['Third_Quarter'], grade['Fourth_Quarter']))
      .filter(avg => avg > 0);

    const total = averages.reduce((sum, avg) => sum + avg, 0);
    return averages.length > 0 ? this.roundCustom(total / averages.length) : 0;
  }
}