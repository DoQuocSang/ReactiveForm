import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input({ required: true }) item!: Product;

  getFeatureImage(): string {
    return this.item.images.length
      ? this.item.images[0].url
      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdveE4s_eyYYAAJOFDxVVq2NRatc6EjMdQ2Vf699x0aKSsrymAV4r5vAE55HRC6GIJ5gg&usqp=CAU';
  }
}
