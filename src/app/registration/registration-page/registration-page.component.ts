import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css'
})
export class RegistrationPageComponent {
  isLinear = false;

}
