import { fromEvent, merge } from 'rxjs';
import { throttleTime, map, scan, count } from 'rxjs/operators';

const eyeElements = document.querySelectorAll('.eye');
const position = document.querySelector('#position');
const clicks = document.querySelector('#clicks');
const copia = document.querySelector('#copia');
const pega = document.querySelector('#pega');
let container = document.querySelector('body > div.grid > div.grid-console > div.console');

const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
    throttleTime(200),
    map((event: MouseEvent) => {
        return {
            x: event.clientX,
            y: event.clientY
        };
    })
);

const click$ = fromEvent<MouseEvent>(document, 'click').pipe(
    scan((count) => count + 1, 0)
)

const copy$ = fromEvent<ClipboardEvent>(document, "copy").pipe(
    map((event: ClipboardEvent) => {
        let clipboardData = event.clipboardData?.getData('text/plain');
        return {
            text: clipboardData
        };
    })
);

const paste$ = fromEvent<ClipboardEvent>(document, "paste").pipe(
    map((event: ClipboardEvent) => {
        let data = event.clipboardData?.getData('text/plain');
        return {
            text: data
        }
    })
);

mousemove$.subscribe({
    next: (coordinates) => {eyeElements.forEach((eye: any) => {
                const rect = eye.getBoundingClientRect();

                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;

                const radian = Math.atan2(coordinates.x - x, coordinates.y - y);
                const rotation = (radian * (180 / Math.PI) * -1) + 270;

                eye.style.transform = `rotate(${rotation}deg)`;

                if (position) {
                    position.innerHTML = `<p>X = ${coordinates.x} | Y = ${coordinates.y}</p> `;
                }
            })},
    complete: () => console.log("Complete")
});

click$.subscribe({
    next: (count) => {
        if (clicks) {
            clicks.innerHTML = `<p>${count}</p> `;
        }
    }
})

copy$.subscribe({
    next: (data) => {
        let newDiv = document.createElement('div');
                newDiv.classList.add('message');
                newDiv.textContent = 'Copiaste: ' + data;
                container?.insertBefore(newDiv, container.firstChild);

        if (copia) {
            copia.innerHTML = `<p>${data}</p> `;
        }
    },
    complete: () => {console.log("complete")}
});


paste$.subscribe({
    next: (data) => {
        let newDiv = document.createElement('div');
                newDiv.classList.add('message');
                newDiv.textContent = 'Pegaste: ' + data.text;
                container?.insertBefore(newDiv, container.firstChild);
        console.log(data.text)
    },
    complete: () => {console.log("complete")}
});

