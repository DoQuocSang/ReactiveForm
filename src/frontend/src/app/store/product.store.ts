import { inject, Injectable } from '@angular/core';

import { ImmerComponentStore } from 'ngrx-immer/component-store';
import { finalize, map, of, switchMap, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { formatTime } from '../helpers/general.helper';
import { UploadFile } from '../models/file.model';
import { Paging } from '../models/paging.model';
import { Product } from '../models/product.model';
import { Responses } from '../models/responses.model';
import { Variant } from '../models/variant.model';
import { ApiService } from '../services/api.service';

interface State {
  items: Product[];
  currentProduct: Product;
  currentProductId: string;
  currentVariantId: string;
  isEditVariant: boolean;
  isLoading: boolean;
  activeVariantId: string;
}

const initialState: State = {
  items: [],
  currentProductId: '',
  currentVariantId: '',
  currentProduct: {} as Product,
  isEditVariant: false,
  isLoading: false,
  activeVariantId: 'No variant',
};

const defaultVariant: Variant = {
  id: 'This is id',
  color: '#000000',
  size: 0,
  quantity: 0,
};

const defaultProduct: Product = {
  id: 'P000',
  name: '',
  brand: undefined,
  description: '',
  weight: 0,
  dateStock: formatTime(),
  price: 0,
  type: undefined,
  images: [],
  variants: [],
  visible: false,
};

@Injectable({
  providedIn: 'root',
})
export class ProductStore extends ImmerComponentStore<State> {
  private apiService: ApiService = inject(ApiService);

  constructor() {
    super(initialState);

    let data = sessionStorage.getItem('data');

    if (data) {
      this.patchState({ items: JSON.parse(data) });
    } else {
      this.loadData();
    }
  }

  readonly loadData = this.effect<void>((source$) => {
    var paging: Paging = {
      Page: 1,
      PageSize: 10,
      Filter: 'asc',
    };

    return source$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.apiService.get<Responses>('product', paging).pipe(
          tap((data) => {
            this.setState((state) => {
              return {
                ...state,
                items: data.list,
              };
            });
          }),
          finalize(() => {
            this.patchState({ isLoading: false });
          })
        )
      )
    );
  });

  // of(...products).pipe(
  //   delay(100),
  //   tap((item) => {
  //     this.setState((state) => {
  //       return {
  //         ...state,
  //         items: [...state.items, item],
  //       };
  //     });
  //   }),
  //   finalize(() => {
  //     this.patchState({ isLoading: false });
  //   })
  // )

  readonly vm$ = this.select(
    ({
      items,
      currentProductId,
      currentVariantId,
      isLoading,
      isEditVariant,
      activeVariantId,
    }) => {
      let currentItem = items.find((item) => item.id === currentProductId);

      let currentVariants: Variant[] =
        items.find((item) => item.id === currentProductId)?.variants ?? [];

      let editVariant = currentVariants.find(
        (item) => item.id === currentVariantId
      ) ?? { ...defaultVariant, id: uuidv4() };

      return {
        items,
        isLoading,
        isEditVariant,
        currentItem,
        currentVariants,
        currentVariantId,
        editVariant,
        activeVariantId,
      };
    }
  );

  readonly toggleVariantFormVisible = (id?: string) => {
    this.patchState({
      currentVariantId: id,
      isEditVariant: !this.state().isEditVariant,
    });
  };

  getCurrentItemById(id: string) {
    if (id) {
      return this.apiService
        .get<Product>(`product/${id}`)
        .pipe(map((data) => data || defaultProduct));
    }

    return of(defaultProduct);
  }

  addVariant = this.updater((state, value: Variant) => {
    const product = state.items.find(
      (item) => item.id === this.state().currentProductId
    );

    product?.variants.push(value);
  });

  updateVariant = this.updater((state, value: Variant) => {
    const product = this.getCurrentProduct(state);

    product?.variants.forEach((variant) => {
      if (variant.id === value.id) {
        Object.assign(variant, value);
      }
    });
  });

  readonly addOrUpdateVariant = (value: Variant) => {
    const { currentVariantId } = this.state() || {};

    if (currentVariantId) {
      this.updateVariant(value);
    } else {
      this.addVariant(value);
    }

    this.patchState({ activeVariantId: value.id });

    this.toggleVariantFormVisible();
  };

  private getCurrentProduct(state: State) {
    return state.items.find(
      (item) => item.id === this.state().currentProductId
    );
  }

  readonly deleteVariant = this.updater((state, id: string) => {
    const product = this.getCurrentProduct(state);

    const index = product?.variants.findIndex((item) => item.id === id);

    if (index !== undefined && index !== -1 && product) {
      product.variants.splice(index, 1);
    }
  });

  readonly deleteAllVariants = this.updater((state) => {
    const product = this.getCurrentProduct(state);

    if (product) {
      product.variants = [];
    }
  });

  readonly addImage = this.updater((state, value: UploadFile) => {
    const product = this.getCurrentProduct(state);

    product?.images.push(value);
  });

  readonly deleteImage = this.updater((state, id: string) => {
    const product = this.getCurrentProduct(state);

    const index = product?.images.findIndex((item) => item.id === id);

    if (index !== undefined && index !== -1 && product) {
      product.images.splice(index, 1);
    }
  });

  readonly deleteAllImages = this.updater((state) => {
    const product = this.getCurrentProduct(state);

    if (product) {
      product.images = [];
    }
  });

  readonly deleteProduct = this.updater((state, id: string) => {
    const index = state.items.findIndex((item) => item.id === id);

    if (index !== undefined && index !== -1) {
      state.items.splice(index, 1);
    }
  });

  readonly saveFormData = this.updater((state, product: Product) => {
    if (state.currentProductId !== '') {
      const index = state.items.findIndex((item) => item.id === product.id);
      state.items[index] = product;
    } else {
      state.items.push(product);
    }
    sessionStorage.setItem('data', JSON.stringify(state.items));
  });
}
