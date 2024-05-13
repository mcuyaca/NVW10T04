import { debounceTime, distinctUntilChanged, fromEvent, switchMap, map } from "rxjs"
import {suggestions} from '../../public/autocomplete.json'

const input = document.getElementById('autocomplete-input') as HTMLInputElement

const rDiv = document.getElementById('random-div') as HTMLElement

function findSuggestion(userInput: string) {
  const promise = new Promise<string>(
    (resolve, _reject) => {
      setTimeout(()=>{
        userInput = userInput.toLocaleLowerCase()
        let suggestion = suggestions.find(
          (word) => word.indexOf(userInput) === 0
        )
        if (suggestion) resolve(suggestion)
      }, 400)
    }
  )
  return promise
}

let keyup$ = fromEvent(input, 'keydown').pipe(
  debounceTime(250),
  map( 
    (event) => {
      console.log(event)
      const target = event.target as HTMLInputElement
      return target.value
    }
  ),
  distinctUntilChanged(),
  switchMap(
    (userInput) => findSuggestion(userInput) 
  )
)

keyup$.subscribe(renderAutocomplete)

function renderAutocomplete(value: string):void{
  rDiv.innerText = value
}