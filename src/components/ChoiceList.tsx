import { Choice } from '../types'

interface ChoiceListProps {
  choices: Choice[]
  onChoiceSelect: (nextId: string) => void
}

export function ChoiceList({ choices, onChoiceSelect }: ChoiceListProps) {
  return (
    <ul className="choice-list">
      {choices.map((choice) => (
        <li key={choice.next_id}>
          <button className="choice-button" onClick={() => onChoiceSelect(choice.next_id)}>
            {choice.text}
          </button>
        </li>
      ))}
    </ul>
  )
}
