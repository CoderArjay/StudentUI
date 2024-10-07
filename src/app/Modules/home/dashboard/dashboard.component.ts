import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { AnnouncementComponent } from '../announcement/announcement.component';
import {MatTabsModule} from '@angular/material/tabs';

import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,MatCardModule, MatButtonModule, MatExpansionModule, MatIcon, MatToolbarModule,MatDatepickerModule,
    MatNativeDateModule, CommonModule,MatBottomSheetModule, MatListModule, MatExpansionModule,MatTabsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Sample Subjects data
  Subjects = [
    { name: 'Mathematics', teacher: 'Mr. Smith', class_sched: 'Mon, Wed, Fri - 10:00 AM to 11:00 AM' },
    { name: 'English', teacher: 'Ms. Johnson', class_sched: 'Tue, Thu - 1:00 PM to 2:30 PM' },
    { name: 'Science', teacher: 'Dr. Brown', class_sched: 'Mon, Wed - 9:00 AM to 10:30 AM' },
    // Add more subjects as needed
  ];
  private _bottomSheet = inject(MatBottomSheet);
  
  // Variable to control which content is displayed
  selectedContent!: string;

  readonly panelOpenState = signal(false);

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(AnnouncementComponent);

    bottomSheetRef.afterDismissed().subscribe((result) => {
      if (result === ' subjects') {
        this.selectedContent = 'subjects ';
      } else if (result === 'messages') {
        this.selectedContent = 'messages';
      } else if (result === 'announcements') {
        this.selectedContent = 'announcements';
      }
    });
  }
}