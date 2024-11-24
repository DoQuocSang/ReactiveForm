import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { LucideAngularModule, X } from 'lucide-angular';

import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-variant-form',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './variant-form.component.html',
})
export class VariantFormComponent {
  readonly X = X;

  productStore: ProductStore = inject(ProductStore);
  formBuilder: FormBuilder = inject(FormBuilder);

  vm$ = this.productStore.vm$;

  types: string[] = ['M', 'Boots', 'Loafer', 'Sandal'];

  sizes: number[] = [39, 40, 41, 42, 43];

  variantForm = this.formBuilder.group({
    color: [''],
    size: [0],
    quantity: [0],
  });

  get color() {
    return this.variantForm.get('color')?.value;
  }

  ngOnInit() {
    this.vm$.subscribe((data) => {
      if (data) {
        this.variantForm.patchValue({
          color: data.editVariant?.color,
          size: 0,
          quantity: data.editVariant?.quantity,
        });
      }
    });
  }

  closeForm() {
    this.productStore.toggleVariantFormVisible();
  }

  deleteAllVariants() {}

  addVariant() {}
}
