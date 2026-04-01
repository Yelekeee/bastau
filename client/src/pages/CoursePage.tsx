import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LockClosedIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'
import { useProgressStore } from '../store/progressStore'

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-green-100 text-green-700'
      : score >= 50
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700'
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{score}%</span>
  )
}

export default function CoursePage() {
  const { lessons, fetchLessons, loading } = useProgressStore()

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

  const completedCount = lessons.filter((l) => l.progress?.completed).length
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0

  const isAvailable = (index: number) => {
    if (index === 0) return true
    return lessons[index - 1]?.progress?.completed === true
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Курс казахского языка</h1>
        <p className="text-gray-500 text-sm">80 часов — 10 уроков по методике аффиксальных паттернов</p>

        <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Общий прогресс</span>
            <span className="text-sm text-gray-500">{completedCount} / {lessons.length} уроков</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progressPercent}% завершено</p>
        </div>
      </div>

      {loading && lessons.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lessons.map((lesson, index) => {
            const available = isAvailable(index)
            const completed = lesson.progress?.completed
            const score = lesson.progress?.bestScore ?? 0

            return (
              <Link
                key={lesson.id}
                to={available ? `/lessons/${lesson.id}` : '#'}
                className={`group bg-white rounded-xl border transition-all duration-200 p-5 ${
                  !available
                    ? 'opacity-60 cursor-not-allowed border-gray-100'
                    : completed
                    ? 'border-green-200 hover:border-green-300 hover:shadow-md'
                    : 'border-gray-100 hover:border-teal-200 hover:shadow-md'
                }`}
                onClick={(e) => !available && e.preventDefault()}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        completed
                          ? 'bg-green-100 text-green-700'
                          : available
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {lesson.number}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-tight">
                        {lesson.titleKz}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{lesson.titleRu}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {!available ? (
                      <LockClosedIcon className="h-5 w-5 text-gray-300" />
                    ) : completed ? (
                      <CheckCircleSolid className="h-5 w-5 text-green-500" />
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">{lesson.grammarTopic}</p>
                  <div className="flex items-center gap-2">
                    {completed && score > 0 && <ScoreBadge score={score} />}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <ClockIcon className="h-3 w-3" />
                      {lesson.hoursEstimate}ч
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
