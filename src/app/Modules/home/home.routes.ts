import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewSubjectComponent } from './view-subject/view-subject.component';

export const homeRoutes: Routes = [
  {
    path: 'home-page',
    component: HomePageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'view-subject', component: ViewSubjectComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
];
