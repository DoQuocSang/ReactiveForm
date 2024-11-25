import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  CustomFormComponent,
} from './components/custom-form/custom-form.component';
import {
  VariantFormComponent,
} from './components/variant-form/variant-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VariantFormComponent, CustomFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ReactiveForm';
}
