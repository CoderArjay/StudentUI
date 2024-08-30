import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnnouncementComponent } from './announcement/announcement.component';

export const homeRoutes: Routes = [
  {
    path: 'home-page',
    component: HomePageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'announcement', component: AnnouncementComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
];
