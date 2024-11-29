import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LucideAngularModule, Plus } from 'lucide-angular';

import { ProductStore } from '../../../store/product.store';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    ProductCardComponent,
    LucideAngularModule,
    RouterLink,
  ],
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent {
  readonly Plus = Plus;

  productStore: ProductStore = inject(ProductStore);

  vm$ = this.productStore.vm$;
}
