import { Routes } from '@angular/router';
import { MessagePageComponent } from './message-page/message-page.component';
// import { ComhubComponent } from './comhub/comhub.component';
import { SendComponent } from './send/send.component';
import { ViewComponent } from './view/view.component';

export const messageRoutes: Routes = [
  {
    path: 'message-page', component: MessagePageComponent,
    children: [
        {path: 'messages', component: SendComponent,
            children: [
                {path: 'view/:sid', component: ViewComponent},
            ]
        },
        {path: '', redirectTo: 'messages', pathMatch: 'full'}
    ]
},
{path: '', redirectTo:'message-page', pathMatch: 'full'}
];
