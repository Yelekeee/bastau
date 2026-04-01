import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { Exercise } from '../../types'

interface Props {
  exercises: Exercise[]
}

function FillBlankExercise({ exercise }: { exercise: Exercise }) {
  const [selected, setSelected] = useState<string | null>(null)
  const options = Array.isArray(exercise.options) ? exercise.options : []

  const isCorrect = selected === exercise.answer
  const isDone = selected !== null

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-sm text-gray-500 mb-1">Заполните пропуск</p>
      <p className="text-gray-900 font-medium mb-4">{exercise.prompt}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected === opt
          const isRight = isDone && opt === exercise.answer
          const isWrong = isSelected && !isCorrect
          return (
            <button
              key={opt}
              onClick={() => !isDone && setSelected(opt)}
              disabled={isDone}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                isRight
                  ? 'bg-green-50 border-green-400 text-green-700'
                  : isWrong
                  ? 'bg-red-50 border-red-400 text-red-700'
                  : isSelected
                  ? 'bg-teal-50 border-teal-400 text-teal-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {isDone && (
        <div className={`mt-3 flex items-center gap-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? (
            <><CheckCircleIcon className="h-4 w-4" /> Правильно!</>
          ) : (
            <><XCircleIcon className="h-4 w-4" /> Правильный ответ: <strong>{exercise.answer}</strong></>
          )}
        </div>
      )}
    </div>
  )
}

function MatchExercise({ exercise }: { exercise: Exercise }) {
  const pairs = typeof exercise.options === 'string'
    ? JSON.parse(exercise.options) as Record<string, string>
    : exercise.options as Record<string, string>
  const keys = Object.keys(pairs)
  const values = Object.values(pairs).sort(() => Math.random() - 0.5)
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [leftSel, setLeftSel] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleLeft = (key: string) => {
    if (done) return
    setLeftSel(key)
  }

  const handleRight = (val: string) => {
    if (!leftSel || done) return
    const newSel = { ...selected, [leftSel]: val }
    setSelected(newSel)
    setLeftSel(null)
    if (Object.keys(newSel).length === keys.length) setDone(true)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-sm text-gray-500 mb-1">Сопоставьте</p>
      <p className="text-gray-900 font-medium mb-4">{exercise.prompt}</p>
      <div className="flex gap-6">
        <div className="flex-1 space-y-2">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleLeft(key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                leftSel === key
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : selected[key]
                  ? done && selected[key] === pairs[key]
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : done
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {key}
              {selected[key] && <span className="ml-2 text-xs opacity-70">→ {selected[key]}</span>}
            </button>
          ))}
        </div>
        <div className="flex-1 space-y-2">
          {values.map((val) => (
            <button
              key={val}
              onClick={() => handleRight(val)}
              disabled={Object.values(selected).includes(val) || done}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                Object.values(selected).includes(val)
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-teal-50 hover:border-teal-300'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function BuildSentenceExercise({ exercise }: { exercise: Exercise }) {
  const words = Array.isArray(exercise.options) ? [...exercise.options] : []
  const [used, setUsed] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const addWord = (word: string) => {
    if (done) return
    setUsed([...used, word])
  }

  const removeWord = (idx: number) => {
    if (done) return
    setUsed(used.filter((_, i) => i !== idx))
  }

  const check = () => setDone(true)
  const reset = () => { setUsed([]); setDone(false) }

  const sentence = used.join(' ')
  const isCorrect = sentence === exercise.answer

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-sm text-gray-500 mb-1">Составьте предложение</p>
      <p className="text-gray-900 font-medium mb-4">{exercise.prompt}</p>

      <div className="min-h-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-3 mb-4 flex flex-wrap gap-2 items-center">
        {used.length === 0 ? (
          <span className="text-gray-400 text-sm">Нажмите на слова ниже...</span>
        ) : (
          used.map((w, i) => (
            <button
              key={i}
              onClick={() => removeWord(i)}
              className="px-3 py-1.5 bg-teal-100 text-teal-800 rounded-lg text-sm font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
            >
              {w}
            </button>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {words
          .filter((w) => !used.includes(w))
          .map((word, i) => (
            <button
              key={i}
              onClick={() => addWord(word)}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-teal-50 hover:border-teal-300 transition-colors"
            >
              {word}
            </button>
          ))}
      </div>

      {!done ? (
        <button
          onClick={check}
          disabled={used.length === 0}
          className="btn-primary text-sm disabled:opacity-50"
        >
          Проверить
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? (
              <><CheckCircleIcon className="h-4 w-4" /> Правильно!</>
            ) : (
              <><XCircleIcon className="h-4 w-4" /> Правильно: <strong>{exercise.answer}</strong></>
            )}
          </div>
          <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}

export default function ExercisesTab({ exercises }: Props) {
  if (!exercises || exercises.length === 0) {
    return <p className="text-gray-500">Упражнения не найдены.</p>
  }

  return (
    <div className="space-y-6">
      {exercises.map((ex) => {
        if (ex.type === 'FILL_BLANK') return <FillBlankExercise key={ex.id} exercise={ex} />
        if (ex.type === 'MATCH') return <MatchExercise key={ex.id} exercise={ex} />
        if (ex.type === 'BUILD_SENTENCE') return <BuildSentenceExercise key={ex.id} exercise={ex} />
        return null
      })}
    </div>
  )
}
