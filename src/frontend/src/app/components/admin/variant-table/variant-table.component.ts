import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductStore } from '../../../store/product.store';
import { VariantRowComponent } from '../variant-row/variant-row.component';

@Component({
  selector: 'app-variant-table',
  standalone: true,
  imports: [VariantRowComponent, CommonModule],
  templateUrl: './variant-table.component.html',
})
export class VariantTableComponent {
  productStore: ProductStore = inject(ProductStore);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  id: string = '';

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  vm$ = this.productStore.vm$;

  openVariantForm() {
    this.productStore.toggleVariantFormVisible();
  }

  deleteAllVariants() {
    this.productStore.deleteAllVariants();
  }
}
