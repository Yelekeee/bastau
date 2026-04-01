import { useState } from 'react'
import { Lesson } from '../../types'

interface Props {
  lesson: Lesson
}

export default function TheoryTab({ lesson }: Props) {
  const [lang, setLang] = useState<'kz' | 'ru'>('ru')

  const content = lang === 'ru' ? lesson.theoryRu : lesson.theoryKz

  // Simple markdown-like renderer
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h2 key={i} className="text-xl font-bold text-gray-900 mt-4 mb-2">{line.slice(2)}</h2>
      }
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-4 mb-2">{line.slice(3)}</h3>
      }
      if (line.startsWith('| ')) {
        return (
          <div key={i} className="font-mono text-sm bg-gray-50 px-3 py-1 border-b border-gray-200">
            {line}
          </div>
        )
      }
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="text-gray-700 ml-4 list-disc">
            {line.slice(2)}
          </li>
        )
      }
      if (line === '') {
        return <div key={i} className="h-2" />
      }
      return <p key={i} className="text-gray-700">{line}</p>
    })
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setLang('ru')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            lang === 'ru' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Русский
        </button>
        <button
          onClick={() => setLang('kz')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            lang === 'kz' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Қазақша
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-1">
        {renderContent(content)}
      </div>

      {lesson.phrases && lesson.phrases.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Ключевые фразы</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lesson.phrases.map((phrase, i) => (
              <div key={i} className="bg-teal-50 rounded-lg px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-teal-800">{phrase.kz}</span>
                <span className="text-gray-600 text-sm">{phrase.ru}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
