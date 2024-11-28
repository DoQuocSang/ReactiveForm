import {
  Component,
  inject,
  Input,
} from '@angular/core';

import {
  LucideAngularModule,
  Trash,
} from 'lucide-angular';

import { UploadFile } from '../../../models/file.model';
import { ProductStore } from '../../../store/product.store';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './upload-file.component.html',
})
export class UploadFileComponent {
  @Input({ required: true }) item!: UploadFile;

  readonly Trash = Trash;

  private productStore: ProductStore = inject(ProductStore);

  deleteImage(id: string) {
    this.productStore.deleteImage(id);
  }

  covertToMB(value: number) {
    return (value / 1024 / 1024).toFixed(2);
  }

  formatFileName(value: string) {
    return value.slice(0, 8) + '...';
  }
}
