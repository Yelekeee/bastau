import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useProgressStore } from '../store/progressStore'
import TheoryTab from '../components/lesson/TheoryTab'
import ExercisesTab from '../components/lesson/ExercisesTab'
import DialogueTab from '../components/lesson/DialogueTab'
import QuizTab from '../components/lesson/QuizTab'

const TABS = [
  { key: 'theory', label: 'Теория' },
  { key: 'exercises', label: 'Упражнения' },
  { key: 'dialogue', label: 'Диалог' },
  { key: 'quiz', label: 'Тест' },
]

export default function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const { currentLesson, fetchLesson, loading } = useProgressStore()
  const [activeTab, setActiveTab] = useState('theory')

  useEffect(() => {
    if (id) fetchLesson(parseInt(id))
  }, [id, fetchLesson])

  if (loading && !currentLesson) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-teal-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!currentLesson) {
    return (
      <div className="p-8 text-center text-gray-500">
        Урок не найден.{' '}
        <Link to="/course" className="text-teal-600 underline">
          Назад к курсу
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Back + header */}
      <div className="mb-6">
        <Link
          to="/course"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          К курсу
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                Урок {currentLesson.number}
              </span>
              {currentLesson.progress?.completed && (
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Завершён
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{currentLesson.titleKz}</h1>
            <p className="text-gray-600">{currentLesson.titleRu}</p>
            <p className="text-sm text-gray-400 mt-1">{currentLesson.grammarTopic}</p>
          </div>
          {currentLesson.progress && currentLesson.progress.bestScore > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-500">Лучший результат</p>
              <p className="text-2xl font-bold text-teal-600">{currentLesson.progress.bestScore}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'theory' && <TheoryTab lesson={currentLesson} />}
      {activeTab === 'exercises' && (
        <ExercisesTab exercises={currentLesson.exercises ?? []} />
      )}
      {activeTab === 'dialogue' && <DialogueTab lesson={currentLesson} />}
      {activeTab === 'quiz' && currentLesson.quiz && (
        <QuizTab
          quiz={currentLesson.quiz}
          lessonId={currentLesson.id}
          existingBestScore={currentLesson.progress?.bestScore}
        />
      )}
    </div>
  )
}
