import { Routes } from '@angular/router';

import { CustomFormComponent } from './components/admin/custom-form/custom-form.component';
import { ErrorComponent } from './components/error/error.component';
import { AdminLayoutComponent } from './components/layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './components/layouts/user-layout/user-layout.component';
import { ProductsListComponent } from './components/user/products-list/products-list.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'product/:id', component: CustomFormComponent },
      { path: '', redirectTo: 'product', pathMatch: 'full' },
    ],
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      { path: 'list', component: ProductsListComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', component: ErrorComponent },
];
