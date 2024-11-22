import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  CustomFormComponent,
} from './components/custom-form/custom-form.component';
import {
  ProductVariantFormComponent,
} from './components/product-variant-form/product-variant-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomFormComponent, ProductVariantFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ReactiveForm';
}
