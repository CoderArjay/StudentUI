import { Routes } from '@angular/router';
import { EnrollmentPageComponent } from './enrollment-page/enrollment-page.component';
import { StepperComponent } from './stepper/stepper.component';

export const enrollmentRoutes: Routes = [
  {
    path: 'enrollment-page',
    component: EnrollmentPageComponent,
    children: [
      { path: 'stepper', component: StepperComponent },
      { path: '', redirectTo: 'stepper', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'enrollment-page', pathMatch: 'full' },
];
