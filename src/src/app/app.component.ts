import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CustomFormComponent } from './custom-form/custom-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ReactiveForm';
}
