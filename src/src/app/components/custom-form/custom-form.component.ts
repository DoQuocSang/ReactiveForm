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
  Edit,
  LucideAngularModule,
  Trash,
} from 'lucide-angular';
import { v4 as uuidv4 } from 'uuid';

import { Variant } from '../../models/variant.model';
import { ProductStore } from '../../store/product.store';
import {
  VariantTableComponent,
} from '../variant-table/variant-table.component';

@Component({
  selector: 'app-custom-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    VariantTableComponent,
  ],
  templateUrl: './custom-form.component.html',
})
export class CustomFormComponent {
  readonly Trash = Trash;
  readonly Edit = Edit;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private productStore: ProductStore = inject(ProductStore);

  vm$ = this.productStore.vm$;

  brands: string[] = [
    'Nike',
    'Adidas',
    'Puma',
    'Asics',
    'New Balance',
    'Reebok',
    'Under Armour',
    'Converse',
    'Vans',
    'Fila',
  ];

  types: string[] = ['Shoes', 'Boots', 'Loafer', 'Sandal'];

  productForm = this.formBuilder.group({
    id: [uuidv4()],
    name: [''],
    brand: [0],
    type: [0],
    description: [''],
    dateStock: [''],
    weight: [0],
    price: [0],
    variants: [[] as Variant[]],
  });

  get type() {
    return this.productForm.get('type')?.value;
  }

  ngOnInit() {
    this.productStore.getCurrentItem().subscribe((data) => {
      if (data) {
        this.productForm.patchValue({
          id: data.id,
          name: data.name,
          brand: data.brand,
          type: data.type,
          description: data.description,
          dateStock: data.dateStock.toISOString().split('T')[0],
          weight: data.weight,
          price: data.price,
          variants: data.variants,
        });
      }
    });
  }

  onSubmit() {
    // console.warn(this.productForm.value);
    sessionStorage.setItem('formData', JSON.stringify(this.productForm.value));
    const data = JSON.parse(sessionStorage.getItem('formData') ?? '');
    console.log(data);
  }
}
