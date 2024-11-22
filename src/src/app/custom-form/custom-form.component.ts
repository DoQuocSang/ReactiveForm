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

  size: number[] = [30, 32, 36, 38, 10];
  default: number = 32;

  constructor() {
    // this.color().setValue
  }

  productForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(10)]],
    brand: [''],
    price: ['0'],
    variants: this.formBuilder.array([
      this.formBuilder.group({
        color: ['', Validators.required],
        size: [''],
        quantity: ['0'],
      }),
    ]),
  });

  private _variants = this.productForm.get('variants') as FormArray;

  get variants() {
    return this._variants;
  }

  get name() {
    return this.productForm.get('name');
  }

  getColorByIndex(index: number) {
    return this._variants.at(index).get('color');
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
        color: ['blue', Validators.required],
        size: ['30'],
        quantity: ['0'],
      })
    );

    console.log(this._variants.value);
  }

  onSubmit() {
    console.log(this.productForm.value);
    // alert(JSON.stringify(this.productForm.value, null, 1));
  }
}
