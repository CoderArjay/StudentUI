import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalInformationComponent } from '../personal-information/personal-information.component';
import { PaymentComponent } from '../payment/payment.component';
import { PaymentApprovalComponent } from '../payment-approval/payment-approval.component';
import { StudentContractComponent } from '../student-contract/student-contract.component';
import { IDPhotoComponent } from '../id-photo/id-photo.component';
import { SubmissionVerificationComponent } from '../submission-verification/submission-verification.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    MatStepperModule, 
    MatInputModule, 
    ReactiveFormsModule,
    PersonalInformationComponent,
    PaymentComponent,
    PaymentApprovalComponent,
    StudentContractComponent,
    IDPhotoComponent,
    SubmissionVerificationComponent,
    ConfirmationComponent
  ],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent {
  // Define your form controls here if needed
}
