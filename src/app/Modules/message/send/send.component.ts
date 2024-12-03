import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SearchFilterPipe } from '../../../search.pipe';
import { FormsModule } from '@angular/forms';
import { ConnectService } from '../../../connect.service';
import { MatDialog } from '@angular/material/dialog';
// import { ReplyComponent } from '../reply/reply.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-send',
  standalone: true,
  imports: [
     RouterModule,
     SearchFilterPipe,
     RouterOutlet, 
      FormsModule,
      MatIconModule,
      SlicePipe,
      CommonModule
    ],
  templateUrl: './send.component.html',
  styleUrl: './send.component.css'
})
export class SendComponent implements OnInit{
  messages: any[] = []; // Initialize as an array
  conversation: any;
  keyword: string = '';
  sid: any;
  uid: any; // This will be set to the student's LRN
  inputClicked: boolean = false;
  stupar: any;

  constructor(
    private conn: ConnectService,
    private aroute: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.uid = localStorage.getItem('LRN'); // Get student LRN from local storage
    this.getMessages(); // Fetch messages for this student
    this.getStudPar(); // Fetch student/parent data
  }

  getMessages(){
    console.log(this.uid)
    this.conn.getMessages(this.uid).subscribe((result: any) => {
      console.log(result)
      const uniqueMessages = [];
      const seenSenders = new Set();

      for (const msg of result) {
          if (!seenSenders.has(msg.sender_name)) {
              seenSenders.add(msg.sender_name);
              uniqueMessages.push(msg);
          }
      }

      this.messages = uniqueMessages; // Assign filtered messages to 'messages'
    })
  }

  onInputClick() {
    this.inputClicked = true; // Set to true when the input is clicked
    this.keyword = ''; // Clear the keyword if desired
  }

  onBackClick() {
    this.inputClicked = false; // Set to false when back is clicked
    this.keyword = ''; // Clear the keyword if desired
  }

  getStudPar() {
    this.conn.getAdmins().subscribe((result: any) => {
      this.stupar = result; 
    });
  }

  openConvo(sid: any, uid: any) {
    console.log("Navigating to conversation with SID:", sid, "and UID:", uid);
    this.conn.getConvo(sid, uid).subscribe((result: any) => {
        console.log(result); // Check if result is as expected
        this.route.navigate(['/main/message-page/message-page/messages/view', uid]);
    });
}

onUserClick(accountId: string) {
  console.log('Navigating to:', accountId);
}
}