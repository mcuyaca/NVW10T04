import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <a href="./src/page/example.html"  > Ir a btn example </a>
 <button class="button"> Hola </button>
 <button class="button button--secondary"> Hola </button>
 <button class="button button--outline" > Hola </button>
  </div>
`;
