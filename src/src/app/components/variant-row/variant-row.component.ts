import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { Edit, LucideAngularModule, Trash } from 'lucide-angular';

import { Variant } from '../../models/variant.model';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: '[app-variant-row]',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './variant-row.component.html',
  host: {
    class: 'border-b border-slate-200 hover:bg-slate-100 cursor-pointer',
  },
})
export class VariantRowComponent {
  @Input({ required: true }) item!: Variant;

  readonly Trash = Trash;
  readonly Edit = Edit;

  private productStore: ProductStore = inject(ProductStore);

  vm$ = this.productStore.vm$;

  openVariantForm(id: string) {
    this.productStore.toggleVariantFormVisible(id);
  }
}
