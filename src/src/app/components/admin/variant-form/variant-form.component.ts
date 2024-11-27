import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { LucideAngularModule, X } from 'lucide-angular';
import { v4 as uuidv4 } from 'uuid';

import { Variant } from '../../../models/variant.model';
import { ProductStore } from '../../../store/product.store';

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
    id: [uuidv4()],
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
          id: data.editVariant?.id,
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

  onSubmit() {
    this.productStore.addOrUpdateVariant(this.variantForm.value as Variant);
  }

  addVariant() {}
}
