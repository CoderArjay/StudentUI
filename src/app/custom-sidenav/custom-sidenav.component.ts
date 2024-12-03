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
  lname = '';
  fname = '';
  mname = '';
  profileImage: string | null = null;

  ngOnInit(): void {
    this.loadUserData();
    this.conn.studentPic$.subscribe((newImageUrl) => {
      if (newImageUrl) {
        this.profileImage = newImageUrl; // Update the component's admin picture
      }
    });

    // Optionally, initialize with the image from localStorage
    const user = JSON.parse(localStorage.getItem('student') || '{}');
    if (user && user.student_pic) {
      this.profileImage = user.student_pic;
    }
  }
   

  loadUserData() {
    const userData = localStorage.getItem('student');
    if (userData) {
        const parsedData = JSON.parse(userData);
        this.lname = parsedData.lname || '';
        this.fname = parsedData.fname || '';
    }
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