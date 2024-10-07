import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
export class CustomSidenavComponent {
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
 
  profilePicSize = computed( ()=> this.sideNavCollapsed() ? '60' : '100');
}