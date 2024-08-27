import {ChangeDetectionStrategy, Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [MatTableModule,MatCardModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
}
