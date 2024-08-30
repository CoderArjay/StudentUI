import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

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
export class GradesReportComponent {
  student = {
    name: 'John Doe',
    grade: 7, // Change this value to test different grades
    grades: {
      Mathematics: { Semester1: 'A', Semester2: 'B+', Q1: 'A', Q2: 'B+' },
      Science: { Semester1: 'B', Semester2: 'A', Q1: 'B+', Q2: 'A-' },
      History: { Semester1: 'A-', Semester2: 'B', Q1: 'A', Q2: 'B+' },
    } as Grades
  };

  quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  semesters = ['Semester1', 'Semester2'];

  // Define colors for each subject
  subjectColors: { [key: string]: string } = {
    Mathematics: '#FF5733', // Red
    Science: '#33FF57',      // Green
    History: '#3357FF',      // Blue
  };


  constructor() {}

  get periods(): string[] {
    // Show quarters for grades 7-10, semesters for grades 11-12
    return this.student.grade >= 7 && this.student.grade <= 10 ? this.quarters : this.semesters;
  }

  get subjects(): string[] {
    return Object.keys(this.student.grades);
  }

  getGrade(subject: string, period: string): string {
    return this.student.grades[subject][period] || 'N/A';
  }
}