import { Component, computed, signal, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {  MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CustomSidenavComponent } from "../custom-sidenav/custom-sidenav.component";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectService } from '../connect.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    RouterModule, MatSidenavModule, 
    CommonModule, MatToolbarModule, 
    MatButtonModule, MatIconModule, 
    MatListModule, CustomSidenavComponent,
    MatExpansionModule, MatBadgeModule, MatMenuModule, MatTooltipModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
  collapsed = signal(false);

  // Dynamically calculate sidenav width based on state
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

  
  lname = '';
  fname = '';
  mname = '';
  profileImage: string | null = null;

  isSmallScreen = false; // To track if the screen is small

  constructor(private conn: ConnectService, private router: Router, private breakpointObserver: BreakpointObserver) {} // Use Router instead of RouterModule

  ngOnInit(): void {
    this.loadUserData();
    
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe((result) => {
      this.isSmallScreen = result.matches; // Update isSmallScreen based on match
      if (this.isSmallScreen) {
        this.collapsed.set(true); // Collapse sidenav on small screens
      }
    });

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
      // this.role = parsedData.role || '';
      this.lname = parsedData.lname || '';
      this.fname = parsedData.fname || '';
    }
  }

// Method to handle logout
onLogout() {
  this.conn.logout().subscribe(
    (response) => {
      console.log('Logout successful:', response);
      localStorage.removeItem('token');
      localStorage.removeItem('student'); 
      localStorage.removeItem('LRN'); 
      this.router.navigate(['/login']); 
    },
    (error) => {
      console.error('Error during logout', error);
    }
  );
}


}
