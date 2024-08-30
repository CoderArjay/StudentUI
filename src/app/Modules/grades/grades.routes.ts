import { Routes } from '@angular/router';
import { GradesPageComponent } from './grades-page/grades-page.component';
import { GradesReportComponent } from './grades-report/grades-report.component';


export const gradesRoutes: Routes = [
  {
    path: 'grades-page',
    component: GradesPageComponent,
    children: [
      { path: 'grades-report', component: GradesReportComponent },
      { path: '', redirectTo: 'grades-report', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'grades-page', pathMatch: 'full' },
];
