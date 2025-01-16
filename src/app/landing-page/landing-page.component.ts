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
  announcementCount: number = 0;
  announcements: any[] = []; // Array to hold announcements
  profileImage: string | null = null;

  // Dynamically calculate sidenav width based on state
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

  constructor(private conn: ConnectService, private router: Router, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.loadUserData();
    
    // Observe screen size changes
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe((result) => {
      if (result.matches) {
        this.collapsed.set(true); // Collapse sidenav on small screens
      }
    });

    // Load announcements
    this.loadAnnouncements();
  }

  loadUserData() {
    const userData = localStorage.getItem('student');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.profileImage = parsedData.student_pic || null; // Assuming student_pic is part of user data
    }
  }

  loadAnnouncements() {
    const uid = localStorage.getItem('LRN'); // Assuming LRN is used as uid
    if (uid) {
      this.conn.getAnnouncementCount(uid).subscribe(response => {
        this.announcementCount = response; // Set the announcement count
        this.fetchAnnouncements(uid); // Fetch announcements details
      });
    }
  }

  fetchAnnouncements(uid: string) {
    this.conn.getAnnouncement(uid).subscribe(announcements => {
      this.announcements = announcements; // Store fetched announcements
      this.announcementCount = this.announcements.length; // Update count based on fetched announcements
    });
  }

  onNotificationClick() {
    const sid = localStorage.getItem('LRN'); // Get the user ID for marking notifications as viewed
    if (sid) {
      this.conn.markAsViewed(sid).subscribe(() => {
        console.log('Notifications marked as viewed');
        // Optionally refresh the announcement count or fetch new announcements here
        this.loadAnnouncements();
      });
    }
  }

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
