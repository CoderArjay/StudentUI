import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatCardModule],
  // providers: [provideNativeDateAdapter()],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementComponent {
  constructor(public dialogRef:MatDialogRef<AnnouncementComponent>){}

}
