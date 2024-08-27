import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comhub',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule],
  templateUrl: './comhub.component.html',
  styleUrl: './comhub.component.css'
})
export class ComhubComponent {

}
