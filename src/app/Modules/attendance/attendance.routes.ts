import { Routes } from '@angular/router';
import { AttendancePageComponent } from './attendance-page/attendance-page.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';

export const attendanceRoutes: Routes = [
  {
    path: 'attendance-page',
    component: AttendancePageComponent,
    children: [
      { path: 'attendance-report', component: AttendanceReportComponent },
      { path: 'attendance/:subject', component: AttendanceReportComponent },
      { path: '', redirectTo: 'attendance-report', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'attendance-page', pathMatch: 'full' },
];
