import productList from "../data/products.json";
import {
  btnSubmit,
  cartList,
  cartContainer,
  logContainer,
  shop,
} from "./order";

export function renderInitialProducts() {
  productList.forEach((product) => {
    const element = document.createElement("div");
    element.innerHTML = `
          <div class="card-product">
          <span class="category">${product.category}</span>
          <figure>
            <img width="90px" height="90px"
              src="${product.image_url}" alt="${product.name}">
          </figure>
          <p>${product.name}</p>
          <span class="price">$ ${product.price}</span>
          <div class="counter">
            <button data-id="${product.id}" class="button button--secondary "> Agregar</button>
          </div>
        </div>
      `;
    shop?.appendChild(element);
  });
}

export function renderdUpdatedCard() {
  cartContainer.innerHTML = "";
  for (const productId in cartList) {
    const foundProduct = productById(productId, productList);
    const priceRow = document.createElement("div");
    priceRow.className = "price-row";
    priceRow.innerHTML = `
      <p>${foundProduct.name}</p>
      <p>Cantidad: ${cartList[productId]}</p>
    `;
    cartContainer.appendChild(priceRow);
    (btnSubmit as HTMLButtonElement).disabled = false;
  }
}

export function renderOutStock(productId: string) {
  const msg = document.createElement("p");
  msg.style.color = "red";
  msg.style.fontSize = "0.8rem";
  const foundProduct = productById(productId, productList);
  msg.innerHTML = `Producto con ID ${foundProduct.name} fuera de stock`;
  logContainer.appendChild(msg);
}

export function renderCompleteOrder() {
  logContainer.innerHTML = `<p style="color: green;">Se completó la orden!</p>`;
  (btnSubmit as HTMLButtonElement).disabled = true;
  cartContainer.innerHTML = "<p>No hay productos en el carrito</p>";
}

export function productById(productId: string, data: any) {
  return data.find((product: any) => product.id.toString() === productId);
}
