import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ProductStore } from '../../../store/product.store';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductCardComponent],
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent {
  productStore: ProductStore = inject(ProductStore);

  vm$ = this.productStore.vm$;
}
