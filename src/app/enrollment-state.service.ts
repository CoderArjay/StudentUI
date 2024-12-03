import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentStateService {
  personalInfoSubmitted = false;
  enrollmentDetailsSubmitted = false;
  paymentSubmitted = false;
  dsfApproved = false;
  contractSigned = false;
  registrarApproved = false;

  resetState() {
    this.personalInfoSubmitted = false;
    this.enrollmentDetailsSubmitted = false;
    this.paymentSubmitted = false;
    this.dsfApproved = false;
    this.contractSigned = false;
    this.registrarApproved = false;
  }

  // Method to update step statuses based on conditions
  updateStepStatus(step: string, status: boolean) {
    switch (step) {
      case 'personalInfo':
        this.personalInfoSubmitted = status;
        break;
      case 'enrollmentDetails':
        this.enrollmentDetailsSubmitted = status;
        break;
      case 'payment':
        this.paymentSubmitted = status;
        break;
      case 'dsfApproval':
        this.dsfApproved = status;
        break;
      case 'contract':
        this.contractSigned = status;
        break;
      case 'confirmation':
        this.registrarApproved = status;
        break;
      default:
        break;
    }
  }
}
