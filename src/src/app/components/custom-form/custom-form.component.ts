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
  CloudUpload,
  Edit,
  LucideAngularModule,
  Trash,
  X,
} from 'lucide-angular';
import { v4 as uuidv4 } from 'uuid';

import { UploadFile } from '../../models/file.model';
import { Variant } from '../../models/variant.model';
import { ProductStore } from '../../store/product.store';
import { UploadFileComponent } from '../upload-file/upload-file.component';
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
    UploadFileComponent,
  ],
  templateUrl: './custom-form.component.html',
})
export class CustomFormComponent {
  readonly Trash = Trash;
  readonly Edit = Edit;
  readonly CloudUpload = CloudUpload;
  readonly X = X;

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

  fileName = '';
  // images: UploadFile[] = [];

  productForm = this.formBuilder.group({
    id: [uuidv4()],
    name: [''],
    brand: [0],
    type: [0],
    description: [''],
    dateStock: [''],
    weight: [0],
    price: [0],
    images: [[] as UploadFile[]],
    variants: [[] as Variant[]],
  });

  get type() {
    return this.productForm.get('type')?.value;
  }

  get images() {
    return this.productForm.get('images')?.value;
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
          images: data.images,
          variants: data.variants,
        });
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((item) => {
        const file: UploadFile = {
          name: item.name,
          size: item.size,
          url: URL.createObjectURL(item),
        };

        this.productStore.addImage(file);
      });
    }

    // console.log(this.images);
  }

  deleteImage(event: Event) {}

  onSubmit() {
    // console.warn(this.productForm.value);
    sessionStorage.setItem('formData', JSON.stringify(this.productForm.value));
    const data = JSON.parse(sessionStorage.getItem('formData') ?? '');
    console.log(data);
  }
}
