export let minTemp: number | null;
export let maxTemp: number | null;
export let humidity: number | null;
export let windSpeed: number | null;

export function randomNumber(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

export async function fetchData(event: Event) {
	return await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${
			(event.target as HTMLInputElement).value
		}&units=metric&APPID=143454aa39bbe3442a890cdbf3f9db36`
	)
		.then((response) => response.json())
		.then((data) => {
			minTemp = data.main.temp_min;
			maxTemp = data.main.temp_max;
			humidity = data.main.humidity;
			windSpeed = data.wind.speed;
			const btn = document.getElementById('btn') as HTMLButtonElement;
			btn.disabled = false;
			console.log(data);
		})
		.catch((error) => {
			console.error('Error: ', error.message);
			const btn = document.getElementById('btn') as HTMLButtonElement;
			btn.disabled = true;
			minTemp = null;
			maxTemp = null;
			humidity = null;
			windSpeed = null;
		});
}

const inputElement = document.getElementById('city') as HTMLElement;
inputElement.addEventListener('input', fetchData);
