import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SearchFilterPipe } from '../../../search.pipe';
import { FormsModule } from '@angular/forms';
import { ConnectService } from '../../../connect.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
// import { ReplyComponent } from '../reply/reply.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, SlicePipe } from '@angular/common';
import { ComposeComponent } from '../compose/compose.component';



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
      CommonModule,
      MatDialogModule
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
  loadingMessages: boolean = true; // Initially true
  loadingUsers: boolean = true; // Initially true

  constructor(
    private conn: ConnectService,
    private aroute: ActivatedRoute,
    private route: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.uid = localStorage.getItem('LRN'); // Get student LRN from local storage
    this.getMessages(); // Fetch messages for this student
    this.getStudPar(); // Fetch student/parent data
  }

  getMessages(){
    console.log(this.uid)
    this.conn.getMessages(this.uid).subscribe((result: any) => {
      // console.log(result)
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

  // getMessages() {
  //   console.log(this.uid);
  //   this.loadingMessages = true; // Set loading to true before fetching
  //   this.conn.getMessages(this.uid).subscribe((result: any) => {
  //       console.log(result);
  //       const uniqueMessages = [];
  //       const seenSenders = new Set();

  //       for (const msg of result) {
  //           // Check if we have already seen this sender-receiver combination
  //           const identifier = `${msg.message_sender}-${msg.message_reciever}`;
  //           if (!seenSenders.has(identifier)) {
  //               seenSenders.add(identifier); // Track unique sender-receiver pairs
  //               uniqueMessages.push(msg); // Add to unique messages
  //           }
  //       }

  //       this.messages = uniqueMessages; // Assign filtered messages to 'messages'
  //       this.loadingMessages = false; // Set loading to false after fetching
  //   }, error => {
  //       console.error('Error fetching messages:', error);
  //       this.loadingMessages = false; // Ensure loading is false on error
  //   });
  // }

  onInputClick() {
    this.inputClicked = true; // Set to true when the input is clicked
    this.keyword = ''; // Clear the keyword if desired
  }

  onBackClick() {
    this.inputClicked = false; // Set to false when back is clicked
    this.keyword = ''; // Clear the keyword if desired
  }

  getStudPar() {
    this.loadingUsers = true; // Set loading to true before fetching users
    this.conn.getAdmins().subscribe((result: any) => {
      this.stupar = result; 
      this.loadingUsers = false; // Set loading to false after fetching users
    }, error => {
      console.error('Error fetching users:', error);
      this.loadingUsers = false; // Ensure loading is false on error
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

openDialog(): void {
  const dialogRef = this.dialog.open(ComposeComponent, {
    width:"500px",
  });

  dialogRef.afterClosed().subscribe(result => {
    this.getMessages(); // Refresh messages after dialog closes
  });
}

trackByFn(index: number, item: any): any {
    return item.account_id || item.message_id; // Adjust based on your data structure
}

markAsRead(sid: any){
  this.conn.markAsRead(sid).subscribe((result: any) => {
    console.log('Messages marked as read:', result.updated_count);
  })

  this.getMessages()
}

}