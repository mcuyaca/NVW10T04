import { fromEvent } from 'rxjs';
import { throttleTime, map, scan } from 'rxjs/operators';

const button = document.querySelectorAll('.button');
const textarea = document.querySelectorAll('#textarea');
const checkbox = document.querySelectorAll('input[type="checkbox"]');

const buttonClick$ = fromEvent<MouseEvent>(button, 'click').pipe(
    throttleTime(1500),
    map((event: MouseEvent) => {
        return {
            textButton: (event.target as HTMLInputElement).textContent
        };
    })
);

buttonClick$.subscribe(data => {
    printConsole("Clickeaste el boton", data.textButton)
});


const checkBoxClick$ = fromEvent<Event>(checkbox, 'change').pipe(
    map((event: Event) => {
        let target = (event.target as HTMLInputElement)
        return {
            text: target.value,
            checked: target.checked ? 'checked' : 'unchecked'
        }
    })
);

checkBoxClick$.subscribe(status => {
    if (status.checked === 'checked') {
        printConsole("Marcaste", status.text)
    } else if (status.checked === 'unchecked') {
        printConsole("Desmarcaste", status.text)
    }
});

const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
    throttleTime(100),
    map((event: MouseEvent) => {
        return {
            x: event.clientX,
            y: event.clientY
        };
    })
);

mousemove$.subscribe(coordinates => {
    eyeElements.forEach((eye: any) => {
        const rect = eye.getBoundingClientRect();

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const radian = Math.atan2(coordinates.x - x, coordinates.y - y);
        const rotation = (radian * (180 / Math.PI) * -1) + 270;

        eye.style.transform = `rotate(${rotation}deg)`;
        position!.innerHTML = `<p>X = ${coordinates.x} | Y = ${coordinates.y}</p> `;
    })
});

const click$ = fromEvent<MouseEvent>(document, 'click').pipe(
    scan(count => count + 1, 0)
);

click$.subscribe(count => {
    clicks!.innerHTML = `<p>${count}</p> `;
});

const keyPressed$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
    map((event: KeyboardEvent) => {
        return {
            letter: event.key
        }
    })
);

keyPressed$.subscribe((data) => {
    tecla!.innerHTML = `<p>${data.letter}</p> `;
});

const copy$ = fromEvent<ClipboardEvent>(document, "copy").pipe(
    map((event: ClipboardEvent) => {
        let copy = event.clipboardData?.getData('text/plain');
        return {
            text: copy
        };
    })
);

let countCopy = 0;
copy$.subscribe(data => {
    printConsole("Copiaste", JSON.stringify(data.text))
    countCopy++;
    copia!.innerHTML = `<p>${countCopy}</p> `;
});

const paste$ = fromEvent<ClipboardEvent>(document, "paste").pipe(
    map((event: ClipboardEvent) => {
        let paste = event.clipboardData?.getData('text/plain');
        return {
            text: paste
        }
    })
);

let countPaste = 0;
paste$.subscribe(data => {
    printConsole("Pegaste", data.text)
    countPaste++;
    pega!.innerHTML = `<p>${countPaste}</p> `;
});

const focus$ = fromEvent(textarea, 'focus');
focus$.subscribe(event => {
    console.log(event)
    printConsole("Escribiendo...", null)
});

const blur$ = fromEvent(textarea, 'blur').pipe(
    map(event => {
        let target = (event.target as HTMLInputElement)
        return {
            text: target.value
        }
    })
);

blur$.subscribe(data => {
    printConsole("Escribiste", data.text)
})

const eyeElements = document.querySelectorAll('.eye');
const position = document.querySelector('#position');
const clicks = document.querySelector('#clicks');
const tecla = document.querySelector('#tecla');
const copia = document.querySelector('#copia');
const pega = document.querySelector('#pega');

let container = document.querySelector('body > div.grid > div.grid-console > div.console');

function printConsole(text: string, data: string | undefined | null) {
    let message = (data === null || undefined) ? text : text + ': ' + data;
    let newDiv = document.createElement('div');
    newDiv.classList.add('message');
    newDiv.textContent = message;
    container?.insertBefore(newDiv, container.firstChild);
}

