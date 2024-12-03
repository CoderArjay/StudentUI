import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-contract',
  standalone: true,
  imports: [MatListModule, RouterModule],
  templateUrl: './student-contract.component.html',
  styleUrl: './student-contract.component.css'
})
export class StudentContractComponent {

}
