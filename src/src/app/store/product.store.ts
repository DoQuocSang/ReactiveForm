import { Injectable } from '@angular/core';

import { ImmerComponentStore } from 'ngrx-immer/component-store';
import { delay, finalize, of, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { products } from '../data/products.data';
import { UploadFile } from '../models/file.model';
import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';

interface State {
  items: Product[];
  currentProductId: string;
  currentVariantId: string;
  isEditVariant: boolean;
  isLoading: boolean;
  activeVariantId: string;
}

const initialState: State = {
  items: [],
  currentProductId: 'P000',
  currentVariantId: 'V000',
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

@Injectable({
  providedIn: 'root',
})
export class ProductStore extends ImmerComponentStore<State> {
  constructor() {
    super(initialState);
    this.loadData();
  }

  readonly loadData = this.effect<void>((source$) =>
    source$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      tap(
        of(...products).pipe(
          delay(0),
          tap((item) => {
            this.setState((state) => {
              return {
                ...state,
                items: [...state.items, item],
              };
            });
          }),
          finalize(() => {
            this.patchState({ isLoading: false });
          })
        )
      )
    )
  );

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

      let data = sessionStorage.getItem('data');

      if (data) {
        items = JSON.parse(data);
      }

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
    this.patchState({ currentProductId: id });

    return this.select((state) => {
      return state.items.find((item) => item.id === id);
    });
  }

  addVariant = this.updater((state, value: Variant) => {
    state.items.map((item) => {
      item.variants.push(value);
    });
  });

  updateVariant = this.updater((state, value: Variant) => {
    state.items.forEach((item) => {
      item.variants.forEach((variant) => {
        if (variant.id === value.id) {
          Object.assign(variant, value);
        }
      });
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

  readonly deleteVariant = this.updater((state, id: string) => {
    state.items.forEach((item) => {
      item.variants.splice(
        item.variants.findIndex((item) => item.id === id),
        1
      );
    });
  });

  readonly deleteAllVariants = this.updater((state) => {
    const product = this.getCurrentProduct(state);

    if (product) {
      product.variants = [];
    }
  });

  readonly addImage = this.updater((state, value: UploadFile) => {
    state.items.forEach((item) => {
      if (item.id === state.currentProductId) item.images.push(value);
    });
  });

  private getCurrentProduct(state: State) {
    return state.items.find(
      (item) => item.id === this.state().currentProductId
    );
  }

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

  readonly saveFormData = this.updater((state, product: Product) => {
    const index = state.items.findIndex((item) => item.id === product.id);
    state.items[index] = product;

    console.log(state.items);
    // sessionStorage.setItem('data', JSON.stringify(state.items));
  });
}
