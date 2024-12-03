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
  profileImage: string = '';
  collapsed = signal(false);
  screenWidth = window.innerWidth;
  lrn: string = '';

  constructor(private conn: ConnectService, private router: Router) {} // Use Router instead of RouterModule

  ngOnInit(): void {
    this.lrn = JSON.parse(localStorage.getItem('student') || '{}').LRN;
    this.retrieveProfileImage(this.lrn);
  }

  sidenavWidth = computed(() => {
    if (this.screenWidth <= 430) { // Adjust the breakpoint as needed
      return '65px';
    } else {
      return this.collapsed() ? '65px' : '250px';
    }
  });

  @HostListener('window:resize', ['$event'])
onResize(event: UIEvent) {
  this.screenWidth = (event.target as Window).innerWidth;
}


  toggleCollapse() {
    this.collapsed.set(!this.collapsed());
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
