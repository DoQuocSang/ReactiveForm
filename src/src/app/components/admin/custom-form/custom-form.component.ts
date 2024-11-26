import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import {
  Check,
  CloudUpload,
  Edit,
  LucideAngularModule,
  Plus,
  Trash,
  X,
} from 'lucide-angular';
import { v4 as uuidv4 } from 'uuid';

import { UploadFile } from '../../../models/file.model';
import { Variant } from '../../../models/variant.model';
import { ProductStore } from '../../../store/product.store';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { VariantFormComponent } from '../variant-form/variant-form.component';
import { VariantTableComponent } from '../variant-table/variant-table.component';

@Component({
  selector: 'app-custom-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    VariantTableComponent,
    VariantFormComponent,
    UploadFileComponent,
  ],
  templateUrl: './custom-form.component.html',
})
export class CustomFormComponent {
  readonly Trash = Trash;
  readonly Edit = Edit;
  readonly CloudUpload = CloudUpload;
  readonly X = X;
  readonly Plus = Plus;
  readonly Check = Check;

  @Input() id = '';

  @ViewChild('imageUrlInput') imageUrlInput!: ElementRef;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private productStore: ProductStore = inject(ProductStore);

  vm$ = this.productStore.vm$;

  isUseURL: boolean = false;

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
    images: [[] as UploadFile[]],
    variants: [[] as Variant[]],
    visible: [false],
  });

  get type() {
    return this.productForm.get('type')?.value;
  }

  get images() {
    return this.productForm.get('images')?.value;
  }

  get visible() {
    return this.productForm.get('visible')?.value;
  }

  ngOnInit() {
    console.log(this.id);

    this.productStore.getCurrentItemById(this.id).subscribe((data) => {
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
          visible: data.visible,
        });
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((item) => {
        const file: UploadFile = {
          id: uuidv4(),
          name: item.name,
          size: item.size,
          url: URL.createObjectURL(item),
        };

        this.productStore.addImage(file);
      });
    }
  }

  handleAddImage() {
    const inputValue = this.imageUrlInput.nativeElement.value;
    if (inputValue) {
      const file: UploadFile = {
        id: uuidv4(),
        name: 'Image URL',
        size: 0,
        url: inputValue,
      };

      this.productStore.addImage(file);
    }

    this.imageUrlInput.nativeElement.value = '';
  }

  deleteAllImages() {
    this.productStore.deleteAllImages();
  }

  toggleURLInput() {
    this.isUseURL = !this.isUseURL;
  }

  onSubmit() {
    // console.warn(this.productForm.value);
    sessionStorage.setItem('formData', JSON.stringify(this.productForm.value));
    const data = JSON.parse(sessionStorage.getItem('formData') ?? '');
    console.log(data);
  }
}
