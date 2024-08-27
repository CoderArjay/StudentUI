import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatIconModule, RouterModule,MatFormFieldModule, MatInputModule, MatButtonModule,],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {
  hide1 = signal(true);
  hide2 = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide1.set(!this.hide1());
    event.stopPropagation();
  }

  clickEvent2(event: MouseEvent) {
    this.hide2.set(!this.hide2());
    event.stopPropagation();
  }
}
