import { debounceTime, distinctUntilChanged, fromEvent, switchMap, map } from "rxjs"
import {suggestions} from '../../public/autocomplete.json'

const input = document.getElementById('input') as HTMLInputElement

const suggestion = document.getElementById('suggestion') as HTMLElement

let suggestionWord: any = ""

function findSuggestion(userInput: string) {
  const promise = new Promise<string>(
    (resolve, _reject) => {
      setTimeout(()=>{
        // find suggestion
        if (userInput) {
          let input = userInput.toLocaleLowerCase()
          let suggestion = suggestions.find(
            (word) => word.indexOf(input) === 0
          )
          
          // make suggestion match input casing
          if (suggestion) {
            let head = userInput
            let tail = suggestion.slice(head.length)
            suggestionWord = head + tail
            resolve(head + tail)
          }
        } else {
          resolve("")
        }
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

let tab$ = fromEvent<KeyboardEvent>(input, 'keydown').pipe(
  map(
    (event: KeyboardEvent) => {
      return event.key
    }
  ),
)

tab$.subscribe(acceptSuggestion)

keyup$.subscribe(renderSuggestion)

function renderSuggestion(value: string):void{
  suggestion.innerText = value
}

function acceptSuggestion(keyName: string):void{
  if (keyName === 'Tab') {
    input.value = suggestionWord
    suggestion.innerText = ''
  }
}