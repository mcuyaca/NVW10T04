import { combineLatest, fromEvent, interval, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import {
  humidity,
  maxTemp,
  minTemp,
  randomNumber,
  windSpeed,
} from "./stream-functions";

const buttonElement = document.getElementById("btn") as HTMLElement;
const buttonClick$ = fromEvent(buttonElement, "click");

const minTemperature$ = buttonClick$.pipe(
  tap(() => console.log("Actualización en tiempo real")),
  switchMap((_ev) =>
    interval(2000).pipe(
      map((_x) => {
        if (!minTemp) {
          throw new Error("---");
        }
        return (
          Number((minTemp + randomNumber(-5, maxTemp! - minTemp)).toFixed(2)) +
          " °C"
        );
      }),
      catchError((error) => {
        return of(error.message);
      })
    )
  )
);
const maxTemperature$ = buttonClick$.pipe(
  switchMap((_ev) =>
    interval(2000).pipe(
      map((_x) => {
        if (!maxTemp) {
          throw new Error("---");
        }
        return Number((maxTemp + randomNumber(0, 5)).toFixed(2)) + " °C";
      }),
      catchError((error) => {
        return of(error.message);
      })
    )
  )
);
const humidity$ = buttonClick$.pipe(
  switchMap((_ev) =>
    interval(3000).pipe(
      map((_x) => {
        if (!humidity) {
          throw new Error("---");
        }
        return (
          Number(
            (
              humidity + randomNumber(-humidity * 0.15, (100 - humidity) * 0.15)
            ).toFixed(2)
          ) + "%"
        );
      }),
      catchError((error) => {
        return of(error.message);
      })
    )
  )
);
const wind$ = buttonClick$.pipe(
  switchMap((_ev) =>
    interval(1500).pipe(
      map((_x) => {
        if (!windSpeed) {
          throw new Error("---");
        }
        return (
          Number((windSpeed + randomNumber(-windSpeed * 0.15, 10)).toFixed(2)) +
          " Km/h"
        );
      }),
      catchError((error) => {
        return of(error.message);
      })
    )
  )
);

const temperature$ = combineLatest([
  minTemperature$,
  maxTemperature$,
  humidity$,
  wind$,
]);

temperature$.subscribe({
  next: (results: any) => {
    console.log("Resultados: ", results);

    document.querySelector<HTMLDivElement>("#min-temperature")!.innerHTML = `
			<p>${results[0]}</p>
			<img src="/src/assets/min-temp.svg" class="streaming__img">
    `;

    document.querySelector<HTMLDivElement>("#max-temperature")!.innerHTML = `
      <p>${results[1]}</p>
			<img src="/src/assets/max-temp.svg" class="streaming__img">
    `;

    document.querySelector<HTMLDivElement>("#humidity")!.innerHTML = `
      <p>${results[2]}</p>
			<img src="/src/assets/humidity.svg" class="streaming__img--size">
    `;

    document.querySelector<HTMLDivElement>("#wind")!.innerHTML = `
      <p>${results[3]}</p>
			<img src="/src/assets/wind.svg" class="streaming__img">
    `;
  },

  error: (error) => console.error(error.message),
  complete: () => console.log("done"),
});
