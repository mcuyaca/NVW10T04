import { delay, fromEvent, concatMap, from, tap, map } from "rxjs";

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
    return from(checkStockFromApi(productId));
  }),
  map((response) => {
    if (response.stock > 0) {
      cartList[response.productId] = (cartList[response.productId] ?? 0) + 1;
      renderdUpdatedCard();
    } else {
      renderOutStock(response.productId);
    }
  }),
  concatMap(() => from(submitObservable$)),
  map((response) => {
    if (response.ok === true) {
      cartList = {};
      renderCompleteOrder();
    }
  })
);
productObservable$.subscribe();

function checkStockFromApi(
  productId: string
): Promise<{ productId: string; stock: number }> {
  return new Promise<{ productId: string; stock: number }>((resolve) => {
    const product = productById(productId, productStockList);
    const stock = product ? product.stock : 0;
    resolve({ productId, stock });
  });
}

function submitOrderToApi(): Promise<{ ok: boolean }> {
  return new Promise<{ ok: boolean }>((resolve) => {
    resolve({ ok: true });
  });
}
