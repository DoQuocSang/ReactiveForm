import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AdminHeaderComponent } from '../../admin/header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {}
