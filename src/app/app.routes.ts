import { CanActivateFn, Router, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { homeRoutes } from './Modules/home/home.routes';
import { accountRoutes } from './Modules/account/account.routes';
import { messageRoutes } from './Modules/message/message.routes';
import { financialRoutes } from './Modules/financial/financial.routes';
import { gradesRoutes } from './Modules/grades/grades.routes';
import { attendanceRoutes } from './Modules/attendance/attendance.routes';
import { inject } from '@angular/core';
import { authGuard } from './auth.guard';
import { MainPageComponent } from './main-page/main-page.component';
import { RegistrationPageComponent } from './registration/registration-page/registration-page.component';
import { ConfirmationComponent } from './registration/confirmation/confirmation.component';
import { PaymentApprovalComponent } from './registration/payment-approval/payment-approval.component';
import { PaymentComponent } from './registration/payment/payment.component';
import { PersonalInformationComponent } from './registration/personal-information/personal-information.component';
import { StudentContractComponent } from './registration/student-contract/student-contract.component';
import { AdmissionComponent } from './registration/admission/admission.component';
import { EnrollmentPageComponent } from './Modules/enrollment/enrollment-page/enrollment-page.component';
import { StepperComponent } from './Modules/enrollment/stepper/stepper.component';
import { EnrollmentDetailsComponent } from './registration/enrollment-details/enrollment-details.component';
import { EnrollLoginComponent } from './enroll-login/enroll-login.component';

// export const loginGuard: CanActivateFn = (route, state) => {
//   const localData = localStorage.getItem('token');
//   if (localData != null){
//     inject(Router).navigateByUrl('/login');
//     return false;
//   }
//   return true;
// };


export const routes: Routes = [
    { path: 'main-page', component: MainPageComponent },
    {
      path: 'register',
      component: RegistrationPageComponent,
      children: [
        {path: 'admission', component: AdmissionComponent},
        { path: 'personal-information', component: PersonalInformationComponent },
        { path: 'enrollment-details', component:EnrollmentDetailsComponent},
        { path: 'payment', component: PaymentComponent },
        { path: 'dsf-approval', component: PaymentApprovalComponent },
        { path: 'student-contract', component: StudentContractComponent },
        { path: 'confirmation', component: ConfirmationComponent },
        { path: '', redirectTo: 'admission', pathMatch: 'full' },
      ],
    },
    { path: 'enroll-login', component: EnrollLoginComponent,
      //  canActivate: [loginGuard]
      },
    { path: 'login', component: LoginComponent,
      //  canActivate: [loginGuard]
      },
    {
        path: 'main', component: LandingPageComponent,
        children: [
            {
              path: 'home-page',
              loadChildren: () =>
                import('./Modules/home/home.routes').then((r) => homeRoutes),
                canActivate: [authGuard]
            },
            { path: 'enrollment-page', component: EnrollmentPageComponent,
              children: [
                {path: 'stepper', component: StepperComponent},
                { path: '', redirectTo: 'stepper', pathMatch: 'full' }
              ]
              },
            {
              path: 'attendance-page',
              loadChildren: () =>
                import('./Modules/attendance/attendance.routes').then((r) => attendanceRoutes),
              canActivate: [authGuard]
            },
            {
              path: 'grades-page',
              loadChildren: () =>
                import('./Modules/grades/grades.routes').then((r) => gradesRoutes),
              canActivate: [authGuard]
            },
            {
              path: 'financial-page',
              loadChildren: () =>
                import('./Modules/financial/financial.routes').then((r) => financialRoutes),
              canActivate: [authGuard]
            },
            {
              path: 'message-page',
              loadChildren: () =>
                import('./Modules/message/message.routes').then((r) => messageRoutes),
              canActivate: [authGuard]
            },
            {
              path: 'account-page',
              loadChildren: () =>
                import('./Modules/account/account.routes').then((r) => accountRoutes),
              canActivate: [authGuard]
            },
            { path: '', redirectTo: 'home-page', pathMatch: 'full' },
        ],
    },
    { path: '', redirectTo: '/main-page', pathMatch: 'full' },
];