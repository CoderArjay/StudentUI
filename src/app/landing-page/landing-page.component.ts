import { Component, computed, signal, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
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
export class LandingPageComponent {

  collapsed = signal(false);
  screenWidth = window.innerWidth;

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

}
