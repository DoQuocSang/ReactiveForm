import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../models/product.model';
import { ProductStore } from '../../../store/product.store';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input({ required: true }) item!: Product;
  private productStore: ProductStore = inject(ProductStore);

  getFeatureImage(): string {
    return this.item.images.length
      ? this.item.images[0].url
      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdveE4s_eyYYAAJOFDxVVq2NRatc6EjMdQ2Vf699x0aKSsrymAV4r5vAE55HRC6GIJ5gg&usqp=CAU';
  }

  deleteProduct(id: string) {
    this.productStore.deleteProduct(id);
  }
}
