import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectService } from '../connect.service';

export type MenuItem = {
  icon: string,
  label: string,
  route: string,
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent, MatTooltipModule],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.css',
})
export class CustomSidenavComponent implements OnInit {
  fname: string = '';
  lname: string = '';
  lrn: string = '';
  profileImage: string = '';

  ngOnInit(): void {
    this.retrieveStudentData(); 
    this.lrn = JSON.parse(localStorage.getItem('student') || '{}').LRN;
    this.retrieveProfileImage(this.lrn);
  }

  constructor(private conn: ConnectService, private router: Router) {}

  sideNavCollapsed = signal(false)
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val);
  }
  
  menuItems = signal<MenuItem[]>([
    {
      icon: 'home',
      label: 'Home',
      route: 'home-page'
    },
    {
      icon: 'assignment',
      label: 'Enrollment',
      route: 'enrollment-page',
    },
    {
      icon: 'table',
      label: 'Attendance',
      route: 'attendance-page'
    },
    {
      icon: 'grade',
      label: 'Grades',
      route: 'grades-page'
    },
    {
      icon: 'money',
      label: 'Financial',
      route: 'financial-page'
    },
   
    {
      icon: 'chat',
      label: 'Message',
      route: 'message-page'
    },
]);

retrieveStudentData(): void {
  const student = JSON.parse(localStorage.getItem('student') || '{}');

  if (student) {
    this.fname = student.fname || '';
    this.lname = student.lname || '';
  } else {
    console.error('No student data found.');
  }
}
 
  profilePicSize = computed( ()=> this.sideNavCollapsed() ? '60' : '100');
  retrieveProfileImage(LRN: string): void {
    this.conn.getProfileImage(LRN).subscribe(
      response => {
        if (response.image_url) {
          this.profileImage = response.image_url;
        } else {
          console.error('No image URL found in response.');
        }
      },
      error => {
        console.error('Error fetching profile image:', error);
      }
    );
  }
}