import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { homeRoutes } from './Modules/home/home.routes';
import { accountRoutes } from './Modules/account/account.routes';
import { messageRoutes } from './Modules/message/message.routes' 
import { enrollmentRoutes } from './Modules/enrollment/enrollment.routes';
import { financialRoutes } from './Modules/financial/financial.routes';
import { gradesRoutes } from './Modules/grades/grades.routes';
import { attendanceRoutes } from './Modules/attendance/attendance.routes';


export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {
        path: 'main', component: LandingPageComponent,
        children: [
            {
              path: 'home-page',
              loadChildren: () =>
                import('./Modules/home/home.routes').then((r) => homeRoutes),
            },
            {
              path: 'enrollment-page',
              loadChildren: () =>
                import('./Modules/enrollment/enrollment.routes').then((r) => enrollmentRoutes),
            },
            {
              path: 'attendance-page',
              loadChildren: () =>
                import('./Modules/attendance/attendance.routes').then((r) => attendanceRoutes),
            },
            {
              path: 'grades-page',
              loadChildren: () =>
                import('./Modules/grades/grades.routes').then((r) => gradesRoutes),
            },
            {
              path: 'financial-page',
              loadChildren: () =>
                import('./Modules/financial/financial.routes').then((r) => financialRoutes),
            },
            {
              path: 'message-page',
              loadChildren: () =>
                import('./Modules/message/message.routes').then((r) => messageRoutes),
            },
            {
              path: 'account-page',
              loadChildren: () =>
                import('./Modules/account/account.routes').then((r) => accountRoutes),
            },
            { path: '', redirectTo: 'home-page', pathMatch: 'full' },
        ],
    },
    {path: '', redirectTo: '/login', pathMatch: 'full' },
];
