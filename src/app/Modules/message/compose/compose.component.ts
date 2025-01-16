import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { SendComponent } from '../send/send.component';
import { MatButtonModule } from '@angular/material/button';
import { ConnectService } from '../../../connect.service';

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatDialogActions,
    MatButtonModule,
    CommonModule,
    MatAutocompleteModule
  ],
  templateUrl: './compose.component.html',
  styleUrl: './compose.component.css'
})
export class ComposeComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SendComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  myControl = new FormControl('');
  recipients: any[] = [];
  filteredOptions!: Observable<any[]>;
  selectedReceiverName: string = ''; // Property to hold the selected receiver's name

  msgForm = new FormGroup({
    message_sender: new FormControl(localStorage.getItem('LRN')),
    message_reciever: new FormControl(''),
    message: new FormControl('')
  });
  


  constructor(private conn: ConnectService) {}

  ngOnInit(): void {
    this.conn.getRecipients().subscribe((data) => {
      this.recipients = data;
      console.log(this.recipients); // Check if receiver_name exists in each recipient object
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.recipients.filter(option => {
      const receiverName = option.receiver_name ? option.receiver_name.toLowerCase() : '';
      return receiverName.includes(filterValue);
    });
  }

  onOptionSelected(option: any): void {
    if (option && option.receiver_id) {
      this.msgForm.patchValue({
        message_reciever: option.receiver_id 
      });
      console.log('Form after patching:', this.msgForm.value); 
      this.myControl.setValue(option.receiver_name);
    } else {
      console.error('Selected option does not have receiver_id:', option);
    }
  }


  onNoClick(){
    this.dialogRef.close(); 
  }

  submit(): void {
    if (this.msgForm.valid) {
      const messageData = {
        message_sender: this.msgForm.value.message_sender,
        message_reciever: this.msgForm.value.message_reciever,
        message: this.msgForm.value.message,
        message_date: new Date().toISOString().split('T')[0], // Get current date in 'YYYY-MM-DD' format
      };
  
      // Make HTTP POST request to send the message
      this.conn.composeMessage(messageData).subscribe({
        next: (response) => {
          console.log('Message sent successfully:', response);
          // Close the dialog and pass the message back to SendComponent
          this.dialogRef.close(messageData);
          
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      });
    } else {
      console.error('Form is not valid');
    }
}
}