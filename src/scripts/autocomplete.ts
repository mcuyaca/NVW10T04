import { debounceTime, from, fromEvent, map, switchMap } from "rxjs";

const searchElement = document.querySelector("#search")! as HTMLInputElement;
const resultContainerElement = document.querySelector(
  "#results"
)! as HTMLDivElement;
const resultTitleElement = document.querySelector(
  "#results-title"
) as HTMLElement;

async function getResultsFromApi(query: string) {
  const response = await fetch(
    `https://api.github.com/search/users?q=${query}`
  );
  return response.json();
}

function showResults(data: GithubUSer) {
  resultTitleElement.textContent = "Usuarios Encontrados";
  resultContainerElement.innerHTML = ``;
  data.items.find((user: Item, index) => {
    const resultsElement = document.createElement("li");
    resultsElement.innerHTML = `
<img src="${user.avatar_url}" alt="" height="20" width="20">
     ${user.login} <a  href="${user.html_url}"> <i class="fa-brands fa-github"></i></a> 
     `;
    resultContainerElement.appendChild(resultsElement);
    return index === 4;
  });
}

const resultObservable$ = fromEvent(searchElement, "keypress").pipe(
  debounceTime(200),
  map((event) => (event.target as HTMLInputElement).value),
  switchMap((value) => from(getResultsFromApi(value))),
  map((data) => showResults(data))
);

resultObservable$.subscribe(console.log);

export interface GithubUSer {
  total_count: number;
  incomplete_results: boolean;
  items: Item[];
}

export interface Item {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  score: number;
}
