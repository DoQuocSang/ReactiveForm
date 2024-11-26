import { Injectable } from '@angular/core';

import {
  delay,
  finalize,
  of,
  tap,
} from 'rxjs';

import { ComponentStore } from '@ngrx/component-store';

import { products } from '../data/products.data';
import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';

interface State {
  items: Product[];
  currentProductId: string;
  currentVariantId: string;
  isEditVariant: boolean;
  isLoading: boolean;
}

const initialState: State = {
  items: [],
  currentProductId: 'P003',
  currentVariantId: 'V000',
  isEditVariant: false,
  isLoading: false,
};

const defaultVariant: Variant = {
  id: 'V000',
  color: '#000000',
  size: 0,
  quantity: 0,
};

@Injectable({
  providedIn: 'root',
})
export class ProductStore extends ComponentStore<State> {
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
          tap((data) =>
            this.setState((state) => {
              return {
                ...state,
                items: [...state.items, data],
              };
            })
          ),
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
    }) => {
      let currentItem = items.find((item) => item.id === currentProductId);

      let currentVariants: Variant[] =
        items.find((item) => item.id === currentProductId)?.variants ?? [];

      let editVariant =
        currentVariants.find((item) => item.id === currentVariantId) ??
        defaultVariant;

      return {
        items,
        isLoading,
        isEditVariant,
        currentItem,
        currentVariants,
        currentVariantId,
        editVariant,
      };
    }
  );

  readonly toggleVariantFormVisible = (id?: string) => {
    this.patchState({
      currentVariantId: id,
      isEditVariant: !this.state().isEditVariant,
    });
  };

  getCurrentItem() {
    return this.select((state) => {
      return state.items.find((item) => item.id === state.currentProductId);
    });
  }

  addOrUpdateVariant(value: Variant) {
    const { currentVariantId } = this.state() || {};
    // Update
    if (currentVariantId) {
      this.setState((prevState) => ({
        ...prevState,
        items: structuredClone(prevState.items).map((item) => {
          return {
            ...item,
            variants: item.variants.map((variant) =>
              variant.id === currentVariantId
                ? {
                    ...variant,
                    ...value,
                  }
                : variant
            ),
          };
        }),
      }));
    } else {
      // Add
    }

    this.toggleVariantFormVisible();
  }

  updateVariant() {
    const updateVariant = this.state().items.map((item) => {
      return item.variants.find(
        (item) => item.id === this.state().currentVariantId
      );
    });
  }

  //  -------------------
  // Foreach ko return duoc
  //  -------------------
  // findProductByVariantId(id: string) {
  //   for (const product of this.state().items) {
  //     if (product.variants.find((v) => v.id === id)) {
  //       return product;
  //     }
  //   }
  //   return null;
  // }
}
