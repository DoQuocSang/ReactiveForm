import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { UserHeaderComponent } from '../../user/header/header.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, UserHeaderComponent],
  templateUrl: './user-layout.component.html',
})
export class UserLayoutComponent {}
