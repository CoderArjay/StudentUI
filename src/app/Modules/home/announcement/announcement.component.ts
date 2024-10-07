import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatBottomSheetModule,MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [MatButtonModule, MatBottomSheetModule, MatListModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementComponent {

  constructor(private bottomSheetRef: MatBottomSheetRef<AnnouncementComponent>) {}

  selectOption(option: string) {
    this.bottomSheetRef.dismiss(option); // Pass the selected option back to the calling component
  }
}
