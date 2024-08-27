import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ViewSubjectComponent } from '../view-subject/view-subject.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,MatCardModule, MatButtonModule, MatExpansionModule, MatIcon, MatToolbarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private dialog: MatDialog) {}

  openDialog(): void{
    const dialogRef = this.dialog.open(ViewSubjectComponent, {
      height: '400px',
      width: '600px',
  });
}
}