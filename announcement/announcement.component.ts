import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
export class AnnouncementComponent  implements OnInit{
  announcements: any[] = []; // Array to hold announcements
  selectedAnnouncement: any = null;
  
  // klasses: Klass[] = [];
  fname: string = '';
  lname: string = '';
  lrn: number | null = null;

  ngOnInit(): void {
    this.fetchAnnouncements();
  }


  
  fetchAnnouncements(): void {
    this.http.get<any[]>('http://localhost:8000/api/announcement').subscribe(
      data => {
        this.announcements = data; // Populate the announcements array
      },
      error => {
        console.error('Error fetching announcements', error);
      }
    );
  }

  selectAnnouncement(announcement: any): void {
    this.selectedAnnouncement = announcement; // Set the selected announcement
  }

}
