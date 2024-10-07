import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule, MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { HttpErrorResponse } from '@angular/common/http';
import { ConnectService } from '../../connect.service';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatNativeDateModule,
    RouterModule,
    MatListModule,
    CommonModule
  ],
  templateUrl: './personal-information.component.html',
  styleUrl: './personal-information.component.css'
})
export class PersonalInformationComponent implements OnInit{
  @Output() submitted = new EventEmitter<void>(); 

  student: any = {
    suffix: '',
    bplace: '',
    gender: '',
    religion: '',
    pnumber: '',
    address: '',
    email: ''
  };

  constructor(private conn: ConnectService, private router: Router) {}

  ngOnInit(): void {
    
  }

  onSubmit() {
    if (this.student.bdate) {
      const date = new Date(this.student.bdate);
      this.student.bdate = date.toISOString().split('T')[0];
    }

    this.conn.createStudent(this.student).subscribe(
      response => {
        console.log('Student created:', response);
        this.router.navigate(['/register/payment']);
      },
      (error: HttpErrorResponse) => {
        console.error('Error creating student:', error);
      }
    );
  }
}
