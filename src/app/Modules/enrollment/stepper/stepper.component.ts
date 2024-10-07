
import {Component, inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-stepper',
  standalone: true,
 
  imports: [
    MatListModule,
    MatIconModule
  ],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  providers: []
})
export class StepperComponent {
}
