import { Routes } from '@angular/router';
import { AcademicPerformanceComponent } from './academic-performance/academic-performance.component';
import { InquiryPageComponent } from './inquiry-page/inquiry-page.component';
import { FinancialStatementComponent } from './financial-statement/financial-statement.component';

export const inquiryRoutes: Routes = [
  {
    path: 'inquiry-page',
    component: InquiryPageComponent,
    children: [
      { path: 'academic-performance', component: AcademicPerformanceComponent },
      { path: 'financial-statement', component: FinancialStatementComponent },
      { path: '', redirectTo: 'academic-performance', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'inquiry-page', pathMatch: 'full' },
];
