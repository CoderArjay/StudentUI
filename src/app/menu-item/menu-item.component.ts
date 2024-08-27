import { ChangeDetectionStrategy,Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../custom-sidenav/custom-sidenav.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  animations: [
    trigger('expandContractMenu', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('500ms ease-in-out', style({ opacity: 0, height: '*' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0, height: '0px' }))
      ])
    ])
  ],
  imports: [MatListModule, RouterModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css'
})
export class MenuItemComponent {

  item = input.required<MenuItem>()

  collapsed = input(false);

  nestedMenuOpen = signal(false);

  toggleNested(){
    if (!this.item().subItems) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen())
  }

}