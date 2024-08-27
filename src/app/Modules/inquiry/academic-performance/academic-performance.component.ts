import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

export interface PeriodicElement {
  subject: string;
  first: number;
  second: number;
  third: number;
  fourth: number;
  final: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { subject: 'Math', first: 0, second: 0, third: 0, fourth: 0, final: 0 },
  { subject: 'English', first: 0, second: 0, third: 0, fourth: 0, final: 0 },
  { subject: 'TLE', first: 0, second: 0, third: 0, fourth: 0, final: 0 },
  { subject: 'AP', first: 0, second: 0, third: 0, fourth: 0, final: 0 },
  { subject: 'Science', first: 0, second: 0, third: 0, fourth: 0, final: 0 },
  { subject: 'MAPEH', first: 0, second: 0, third: 0, fourth: 0, final: 0 },
  { subject: 'Filipino', first: 0, second: 0, third: 0, fourth: 0, final: 0 },
];

@Component({
  selector: 'app-academic-performance',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatCardModule, CommonModule],
  templateUrl: './academic-performance.component.html',
  styleUrls: ['./academic-performance.component.css'], // Fixed here
})
export class AcademicPerformanceComponent {
  displayedColumns: string[] = ['subject', 'first', 'second', 'third', 'fourth', 'final'];
  dataSource = ELEMENT_DATA;

  datasource = [
    {  subject: 'Mathematics', instructor: 'Mr. Smith', time: '9:00 AM - 10:00 AM', day: 'Monday' },
    {  subject: 'English', instructor: 'Ms. Johnson', time: '10:00 AM - 11:00 AM', day: 'Tuesday' },
    {  subject: 'Science', instructor: 'Dr. Brown', time: '11:00 AM - 12:00 PM', day: 'Wednesday' },
    {  subject: 'History', instructor: 'Mr. Green', time: '1:00 PM - 2:00 PM', day: 'Thursday' },
    {  subject: 'Art', instructor: 'Ms. White', time: '2:00 PM - 3:00 PM', day: 'Friday' },
  ];

  getSubjectColor(subject: string): string {
    switch (subject) {
      case 'Mathematics':
        return 'blue';
      case 'English':
        return 'green';
      case 'Science':
        return 'red';
      case 'History':
        return 'purple';
      case 'Art':
        return 'orange';
      default:
        return 'black';
    }
  }
}