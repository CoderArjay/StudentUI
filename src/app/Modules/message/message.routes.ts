import { Routes } from '@angular/router';
import { MessagePageComponent } from './message-page/message-page.component';
import { ComhubComponent } from './comhub/comhub.component';

export const messageRoutes: Routes = [
  {
    path: 'message-page',
    component: MessagePageComponent,
    children: [
      { path: 'comhub', component: ComhubComponent },
      { path: '', redirectTo: 'comhub', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'message-page', pathMatch: 'full' },
];
