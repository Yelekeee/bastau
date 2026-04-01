import { useState } from 'react'
import { Lesson } from '../../types'

interface Props {
  lesson: Lesson
}

export default function DialogueTab({ lesson }: Props) {
  const [showTranslation, setShowTranslation] = useState(true)

  const dialogueLines = lesson.dialogueKz.split('\n').filter((l) => l.trim())
  const translationLines = lesson.dialogueRu.split('\n').filter((l) => l.trim())

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">Образцовый диалог</h3>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            showTranslation
              ? 'bg-teal-100 text-teal-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {showTranslation ? 'Скрыть перевод' : 'Показать перевод'}
        </button>
      </div>

      <div className="space-y-4">
        {dialogueLines.map((line, i) => {
          const isFirst = line.startsWith('—')
          const speaker = isFirst ? 'A' : 'B'
          const isEven = i % 2 === 0

          return (
            <div key={i} className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${isEven ? 'items-start' : 'items-end'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isEven
                      ? 'bg-white border border-gray-200 rounded-tl-sm'
                      : 'bg-teal-600 text-white rounded-tr-sm'
                  }`}
                >
                  <p className={`text-sm font-medium ${isEven ? 'text-gray-900' : 'text-white'}`}>
                    {line}
                  </p>
                  {showTranslation && translationLines[i] && (
                    <p className={`text-xs mt-1 ${isEven ? 'text-gray-500' : 'text-teal-100'}`}>
                      {translationLines[i]}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">{speaker}</span>
              </div>
            </div>
          )
        })}
      </div>

      {lesson.phrases && lesson.phrases.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Фразы из диалога</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lesson.phrases.map((phrase, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-teal-50 rounded-lg px-4 py-3"
              >
                <span className="font-medium text-teal-800 text-sm">{phrase.kz}</span>
                <span className="text-gray-600 text-xs">{phrase.ru}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
