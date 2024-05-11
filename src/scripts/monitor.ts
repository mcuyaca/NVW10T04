import { fromEvent } from 'rxjs';
import { throttleTime, map } from 'rxjs/operators';

const eyeElements = document.querySelectorAll('.eye');

const mousemove$ = fromEvent(document, 'mousemove').pipe(
    throttleTime(200),
    map((event: any) => {
        return {
            x: event.x,
            y: event.y
        };
    })
);

mousemove$.subscribe({
    next: (coordinates) => {
            eyeElements.forEach((eye: any) => {
                const rect = eye.getBoundingClientRect();

                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;

                const radian = Math.atan2(coordinates.x - x, coordinates.y - y);
                const rotation = (radian * (180 / Math.PI) * -1) + 270;

                eye.style.transform = `rotate(${rotation}deg)`;
            });
        },
    complete: () => console.log("Complete")
});
