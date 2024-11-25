import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ProductStore } from '../../store/product.store';
import { VariantRowComponent } from '../variant-row/variant-row.component';

@Component({
  selector: 'app-variant-table',
  standalone: true,
  imports: [VariantRowComponent, CommonModule],
  templateUrl: './variant-table.component.html',
})
export class VariantTableComponent {
  productStore: ProductStore = inject(ProductStore);

  vm$ = this.productStore.vm$;

  openVariantForm() {
    this.productStore.toggleVariantFormVisible();
  }
}
