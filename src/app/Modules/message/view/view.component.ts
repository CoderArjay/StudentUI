import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectService } from '../../../connect.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit{
  @ViewChild('messageInput') messageInput!: ElementRef;

  adjustInputHeight(input: HTMLTextAreaElement) {
    input.style.height = 'auto'; // Reset height to auto before calculation
    input.style.height = `${input.scrollHeight}px`; // Set the height to match the scroll height
  }

  convo: any = {};
  sid: any;
  uid: any;
  // private intervalId: any;
  
  msgForm = new FormGroup({
    message_sender: new FormControl(localStorage.getItem('LRN')),
    message_reciever: new FormControl(null),
    message: new FormControl(null)
  })

  constructor(private conn: ConnectService,
    private aroute: ActivatedRoute,
    private route: Router,
    private cdRef: ChangeDetectorRef
  ) { }
  
  toggleTimeDisplay(message: any) {
    // Toggle `showTime` for the clicked message
    message.showTime = !message.showTime;
  }

  ngOnInit(): void {
    const uid = localStorage.getItem('LRN')
    this.aroute.paramMap.subscribe(params => {
      const sid = params.get('sid');
      this.sid = sid;
      this.uid = uid;
      this.msgForm.get('message_reciever')?.setValue(this.sid);
      this.getConvo(sid, uid);

      // this.intervalId = setInterval(() => {
      //   this.getConvo(sid, uid);
      // }, 5000)
  });
  }
  
  getConvo(sid: any, uid: any) {
    console.log("Fetching conversation with sid:", sid, "and uid:", uid);
    this.conn.getConvo(sid, uid).subscribe((result: any) => {
        console.log("Received conversation:", result); // Check if data is here
        this.convo = result; // Assign API response to 'convo'
        this.cdRef.detectChanges();
    });
}

  sendMessage(){
    console.log(this.msgForm.value);
    this.conn.sendMessage(this.msgForm.value).subscribe((result: any) => {
      console.log(result);
      // You can also update the conversation list here
      this.getConvo(this.aroute.snapshot.paramMap.get('sid'), this.uid);
      this.msgForm.get('message')?.reset(); 
    })
  }
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) { // Check if Enter is pressed and Shift is not held
      event.preventDefault(); // Prevent default new line behavior
      this.sendMessage(); // Call sendMessage method
    }
  }
}