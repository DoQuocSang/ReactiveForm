import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  LucideAngularModule,
  X,
} from 'lucide-angular';

import { Variant } from '../../../models/variant.model';
import { VariantService } from '../../../services/variant.service';
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
  variantService: VariantService = inject(VariantService);

  vm$ = this.productStore.vm$;

  types: string[] = ['M', 'Boots', 'Loafer', 'Sandal'];

  sizes: number[] = [39, 40, 41, 42, 43];

  variantForm = this.formBuilder.group({
    id: ['abc'],
    color: ['#000000'],
    size: [0],
    quantity: [0],
  });

  currentVariantId?: string;

  get color() {
    return this.variantForm.get('color')?.value;
  }

  get id() {
    return this.variantForm.get('id')?.value;
  }

  ngOnInit() {
    const data = this.variantService.currentVariant;

    this.currentVariantId = this.variantService.currentVariantId;

    if (data) {
      this.variantForm.patchValue({
        id: data.id,
        color: data.color,
        size: 0,
        quantity: data.quantity,
      });
    }
  }

  closeForm() {
    this.variantService.closeVariantForm();
  }

  onSubmit() {
    this.variantService.addOrUpdateVariant(this.variantForm.value as Variant);
    this.variantService.toggleVariantForm();
  }
}
