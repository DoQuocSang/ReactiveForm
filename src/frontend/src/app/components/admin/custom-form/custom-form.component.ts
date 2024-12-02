import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

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

import { errorTailorImports } from '@ngneat/error-tailor';

import { formatDateTime } from '../../../helpers/general.helper';
import { UploadFile } from '../../../models/file.model';
import { Product } from '../../../models/product.model';
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
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    VariantTableComponent,
    VariantFormComponent,
    UploadFileComponent,
    errorTailorImports,
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
  private router: Router = inject(Router);

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
    name: ['', [Validators.required, Validators.minLength(10)]],
    brand: [undefined as number | null | undefined, Validators.required],
    type: [undefined as number | null | undefined, Validators.required],
    description: [''],
    dateStock: [formatDateTime()],
    weight: [0, [Validators.min(0), Validators.max(1000)]],
    price: [
      0,
      [Validators.required, Validators.min(0), Validators.max(1000000)],
    ],
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

  get brand() {
    console.log(this.productForm.get('brand')?.value);
    return this.productForm.get('brand')?.value;
  }

  get visible() {
    return this.productForm.get('visible')?.value;
  }

  get dateStock() {
    return this.productForm.get('dateStock')?.value;
  }

  onDateChange(event: any) {
    this.productForm.patchValue({ dateStock: event.target.value });
  }

  ngOnInit() {
    this.productStore.getCurrentItemById(this.id).subscribe((data) => {
      if (data) {
        console.log(data);
        this.patchValueToForm(data);
      }
    });
  }

  patchValueToForm(data: Product) {
    this.productForm.patchValue({
      id: data.id,
      name: data.name,
      brand: data.brand ?? null,
      description: data.description,
      dateStock: formatDateTime(data.dateStock),
      type: data.type ?? null,
      weight: data.weight,
      price: data.price,
      images: data.images,
      variants: data.variants,
      visible: data.visible,
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.files);

    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((item) => {
        const file: UploadFile = {
          id: uuidv4(),
          name: item.name,
          size: item.size,
          url: URL.createObjectURL(item),
        };

        // this.productStore.addImage(file);
        this.images?.push(file);
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

  checkForm() {
    Object.keys(this.productForm.controls).forEach((field) => {
      const control = this.productForm.get(field);
      if (control && control.invalid) {
        console.log(`${field} errors:`, control.errors);
      }
    });
  }

  onSubmit() {
    this.checkForm();

    console.log(this.productForm.value);

    // if (this.productForm.valid) {
    //   const formData = this.productForm.value as Product;
    //   this.productStore.saveFormData(formData);

    //   this.router.navigate(['/user']);
    // }
  }
}
