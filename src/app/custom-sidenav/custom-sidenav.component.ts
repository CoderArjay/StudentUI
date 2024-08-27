import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';

export type MenuItem = {
  icon: string,
  label: string,
  route: string,
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent],
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
      route: 'enrollment-page'
    },
    {
      icon: 'help_outline',
      label: 'Inquiry',
      route: 'inquiry-page',
      subItems: [
        {
          icon: 'school',
          label: 'Academic Performance',
          route: 'inquiry-page/inquiry-page/academic-performance',
        },
        {
          icon: 'attach_money',
          label: 'Financial Statement',
          route: 'inquiry-page/inquiry-page/financial-statement',
        },
      ]
    },
    {
      icon: 'chat',
      label: 'Message',
      route: 'message-page'
    },
]);
 
  profilePicSize = computed( ()=> this.sideNavCollapsed() ? '60' : '100');
}