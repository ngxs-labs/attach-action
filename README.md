<p align="center">
  <img src="https://raw.githubusercontent.com/ngxs-labs/emitter/master/docs/assets/logo.png">
</p>

---

> ⚡️ Attach independent, pure and easy to test Action Handlers to NGXS States.

[![Build Status](https://travis-ci.com/ngxs-labs/attach-action.svg?branch=master)](https://travis-ci.com/ngxs-labs/attach-action)
[![NPM](https://badge.fury.io/js/%40ngxs-labs%2Fattach-action.svg)](https://www.npmjs.com/package/@ngxs-labs/attach-action)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/ngxs-labs/attach-action/blob/master/LICENSE)

This package allows to attach `ActionHandlers` to `State` classes.

## 📦 Install

To install `@ngxs-labs/attach-action` run the following command:

```console
yarn add @ngxs-labs/attach-action
npm install @ngxs-labs/attach-action
```

## 🔨 Usage

Especially large codebases can get the issue of ending up in sprawling and hard to test NGXS-state-classes. Breaking the state into smaller chunks is not always an option, especially when the data is very cohesive and the interaction between it is complex.

Thus we wanted to move actions into independent, testable and simple to grasp files. For this purpose, a small helper function was introduced which allows the declaration of actions which are handled outside of the state class.

Following this approach brought us in the desirable condition to have all actions and usefully grouped selectors in separate classes. Our file structure in large enterprise applications therefore usually looks ruffly like this:

```
/store
  /shop
    shop.state.ts
    shop.actions.ts
    actions/ 
      add-product-to-cart.action.ts
      add-product-to-cart.action.spec.ts
      fetch-products.action.ts
      fetch-products.action.spec.ts
    selectors/
      products.selector.ts
      prices.selector.ts
```

The responsibility of the state-class itself is just to group und bootstrap all the action declarations: 

```typescript
@State<ShopStateModel>({ name: 'shop', defaults: DEFAULT_SHOP_STATE })
export class ShopState {
  constructor(productService: ProductService) {
    declareAction(ShopState, AddProductToCartAction, addProductToCart);
    declareAction(ShopState, FetchProductsAction, fetchProducts(productService));
    declareAction(ShopState, AnotherAction, ...);
    declareAction(ShopState, [ActionA, ActionB], ...);
  }
}
``` 

The actions are just idiomatic (higher-order) functions: 
```typescript
export const addProductToCart =
  (ctx: StateContext<ShopStateModel>, act: AddProductToCartAction) => {
    ctx.patchState({cart: [act.product]})
}

export const fetchProducts =
  (productService: ProductService) =>
    (ctx: StateContext<ShopStateModel>, act: FetchProductsAction) => {
      productService.fetchProducts().subscribe(products => {
        ctx.patchState({products})
      });
    }
```
