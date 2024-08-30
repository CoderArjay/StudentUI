import { Routes } from '@angular/router';
import { FinancialPageComponent } from './financial-page/financial-page.component';
import { FinancialStatementComponent } from './financial-statement/financial-statement.component';


export const financialRoutes: Routes = [
  {
    path: 'financial-page',
    component: FinancialPageComponent,
    children: [
      { path: 'financial', component: FinancialStatementComponent },
      { path: '', redirectTo: 'financial', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'financial-page', pathMatch: 'full' },
];
