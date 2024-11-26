import { Injectable } from '@angular/core';

import {
  delay,
  finalize,
  of,
  tap,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
  activeVariantId: string;
}

const initialState: State = {
  items: [],
  currentProductId: 'P003',
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

  getCurrentItem() {
    return this.select((state) => {
      return state.items.find((item) => item.id === state.currentProductId);
    });
  }

  addOrUpdateVariant(value: Variant) {
    const { currentVariantId } = this.state() || {};

    if (currentVariantId) {
      this.updateVariant(value);
    } else {
      this.addVariant(value);
    }

    this.patchState({ activeVariantId: value.id });

    this.toggleVariantFormVisible();
  }

  addVariant(value: Variant) {
    console.log(value);

    this.setState((prevState) => ({
      ...prevState,
      items: structuredClone(prevState.items).map((item) => {
        return {
          ...item,
          variants: [...item.variants, value],
        };
      }),
    }));

    console.log(this.state().items[2].variants);
  }

  updateVariant(value: Variant) {
    this.setState((prevState) => ({
      ...prevState,
      items: structuredClone(prevState.items).map((item) => {
        return {
          ...item,
          variants: item.variants.map((variant) =>
            variant.id === value.id
              ? {
                  ...variant,
                  ...value,
                }
              : variant
          ),
        };
      }),
    }));
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
