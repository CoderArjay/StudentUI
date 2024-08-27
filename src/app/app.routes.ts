import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { homeRoutes } from './Modules/home/home.routes';
import { accountRoutes } from './Modules/account/account.routes';
import { inquiryRoutes } from './Modules/inquiry/inquiry.routes';
import { messageRoutes } from './Modules/message/message.routes' 
import { enrollmentRoutes } from './Modules/enrollment/enrollment.routes';
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
              path: 'inquiry-page',
              loadChildren: () =>
                import('./Modules/inquiry/inquiry.routes').then((r) => inquiryRoutes),
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
