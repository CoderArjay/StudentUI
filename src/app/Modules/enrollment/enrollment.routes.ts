import { Routes } from '@angular/router';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentApprovalComponent } from './payment-approval/payment-approval.component';
import { StudentContractComponent } from './student-contract/student-contract.component';
import { IDPhotoComponent } from './id-photo/id-photo.component';
import { SubmissionVerificationComponent } from './submission-verification/submission-verification.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { EnrollmentPageComponent } from './enrollment-page/enrollment-page.component';
import { StepperComponent } from './stepper/stepper.component';

export const enrollmentRoutes: Routes = [
  {
    path: 'enrollment-page',
    component: EnrollmentPageComponent,
    children: [
      { path: 'stepper', component: StepperComponent },
      { path: 'personal-information', component: PersonalInformationComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'payment-approval', component: PaymentApprovalComponent },
      { path: 'student-contract', component: StudentContractComponent },
      { path: 'id-photo', component: IDPhotoComponent },
      { path: 'sub-verify', component: SubmissionVerificationComponent },
      { path: 'confirmation', component: ConfirmationComponent },
      { path: '', redirectTo: 'stepper', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'enrollment-page', pathMatch: 'full' },
];
