import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VariantService } from '../../../services/variant.service';
import { ProductStore } from '../../../store/product.store';
import { VariantFormComponent } from '../variant-form/variant-form.component';
import { VariantRowComponent } from '../variant-row/variant-row.component';

@Component({
  selector: 'app-variant-table',
  standalone: true,
  imports: [VariantRowComponent, CommonModule, VariantFormComponent],
  templateUrl: './variant-table.component.html',
})
export class VariantTableComponent {
  productStore: ProductStore = inject(ProductStore);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private variantService: VariantService = inject(VariantService);

  id: string = '';

  get variants() {
    return this.variantService.variants;
  }

  get isVariantFormVisible() {
    return this.variantService.isVariantFormVisible;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  Log() {
    console.log(this.variants);
  }

  // vm$ = this.productStore.vm$;

  openVariantForm() {
    this.variantService.toggleVariantForm();
  }

  deleteAllVariants() {
    this.productStore.deleteAllVariants();
  }
}
