import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-enrollment-procedures',
  standalone: true,
  imports: [MatDialogModule, MatListModule ],
  templateUrl: './enrollment-procedures.component.html',
  styleUrl: './enrollment-procedures.component.css'
})
export class EnrollmentProceduresComponent {

  constructor(public dialogRef: MatDialogRef<EnrollmentProceduresComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
