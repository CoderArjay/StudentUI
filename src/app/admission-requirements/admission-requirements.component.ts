import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admission-requirements',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './admission-requirements.component.html',
  styleUrl: './admission-requirements.component.css'
})
export class AdmissionRequirementsComponent {

   
  constructor(public dialogRef: MatDialogRef<AdmissionRequirementsComponent>) {}

  close(): void {
    this.dialogRef.close();
  }

}
