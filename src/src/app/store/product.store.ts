import { Injectable } from '@angular/core';

import { delay, finalize, of, tap } from 'rxjs';

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
        editVariant,
      };
    }
  );

  readonly toggleVariantFormVisible = (id?: string) => {
    this.patchState({
      currentVariantId: id,
      isEditVariant: !this.state().isEditVariant,
    });

    console.log(id);

    this.vm$.subscribe((data) => {
      console.log(data.editVariant);
    });
  };

  getCurrentItem() {
    return this.select((state) => {
      return state.items.find((item) => item.id === state.currentProductId);
    });
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
}
