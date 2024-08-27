import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-view-subject',
  standalone: true,
  imports: [MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './view-subject.component.html',
  styleUrl: './view-subject.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSubjectComponent {
constructor(public dialogRef:MatDialogRef<ViewSubjectComponent>){}



}
