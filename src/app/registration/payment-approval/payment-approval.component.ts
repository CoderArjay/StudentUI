import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-approval',
  standalone: true,
  imports: [MatListModule,RouterModule,],
  templateUrl: './payment-approval.component.html',
  styleUrl: './payment-approval.component.css'
})
export class PaymentApprovalComponent {

}
