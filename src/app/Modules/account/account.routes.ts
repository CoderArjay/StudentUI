import { Routes } from '@angular/router';
import { AccountPageComponent } from './account-page/account-page.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';


export const accountRoutes: Routes = [
  {
    path: 'account-page',
    component: AccountPageComponent,
    children: [
      { path: 'personal-info', component: PersonalInfoComponent },
      { path: '', redirectTo: 'personal-info', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'account-page', pathMatch: 'full' },
];
