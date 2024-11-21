import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-custom-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-form.component.html',
})
export class CustomFormComponent {
  private formBuilder = inject(FormBuilder);

  productForm = this.formBuilder.group({
    name: ['', Validators.required],
    brand: [''],
    price: ['0', Validators.required],
    variants: this.formBuilder.array([
      this.formBuilder.group({
        color: [''],
        size: ['0'],
        quantity: ['0'],
      }),
    ]),
  });

  private _variants = this.productForm.get('variants') as FormArray;

  get variants() {
    return this._variants;
  }

  deleteAllVariants() {
    this._variants = this.formBuilder.array([]);
  }

  deleteVariant(index: number) {
    this._variants.removeAt(index);
  }

  addVariant() {
    this._variants.push(
      this.formBuilder.group({
        color: ['blue'],
        size: ['30'],
        quantity: ['0'],
      })
    );

    console.log(this._variants.value);
  }

  onSubmit() {
    console.warn(this.productForm.value);
  }
}
