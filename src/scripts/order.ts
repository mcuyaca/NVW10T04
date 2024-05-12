import { delay, fromEvent, concatMap } from "rxjs";

import productStockList from "../data/productsStock.json";
import {
  renderOutStock,
  renderInitialProducts,
  renderdUpdatedCard,
  renderCompleteOrder,
} from "./order.render";
import { productById } from "./order.render";

type CartList = {
  [k: string]: number;
};

export const logContainer = document.querySelector("#log")!;
export const btnSubmit = document.querySelector("#submit")!;
export const shop = document.querySelector("#shop")!;
export const cartContainer = document.querySelector("#cartList")!;
const randomDelay = Math.round(Math.random() * 1500);

export let cartList: CartList = {};

renderInitialProducts();

const submitObservable$ = fromEvent(btnSubmit, "click").pipe(
  delay(randomDelay),
  concatMap(() => submitOrderToApi())
);

const btnAddAmount = document.querySelectorAll("button[data-id]")!;

const productObservable$ = fromEvent(btnAddAmount, "click").pipe(
  delay(randomDelay),
  concatMap((event) => {
    const productId = (event.target as HTMLButtonElement).dataset.id!;
    return checkStockFromApi(productId);
  }),
  concatMap(() => submitObservable$)
);
productObservable$.subscribe();

function checkStockFromApi(productId: string) {
  return new Promise<void>((resolve) => {
    const foundProduct = productById(productId, productStockList);
    if (foundProduct?.stock! > 0) {
      cartList[productId] = (cartList[productId] ?? 0) + 1;
      renderdUpdatedCard();
    } else {
      renderOutStock(productId);
      cartList = {};
    }
    resolve();
  });
}

function submitOrderToApi() {
  return new Promise<void>((resolve) => {
    renderCompleteOrder();
    resolve();
  });
}
