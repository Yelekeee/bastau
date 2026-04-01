import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, TrophyIcon } from '@heroicons/react/24/solid'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Quiz } from '../../types'
import { useProgressStore } from '../../store/progressStore'

interface Props {
  quiz: Quiz
  lessonId: number
  existingBestScore?: number
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80) return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">{score}% — Отлично!</span>
  if (score >= 50) return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">{score}% — Неплохо</span>
  return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">{score}% — Попробуй ещё</span>
}

export default function QuizTab({ quiz, lessonId, existingBestScore }: Props) {
  const { submitQuiz } = useProgressStore()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{
    score: number
    correct: number
    total: number
    passed: boolean
    results: Record<string, { correct: boolean; correctAnswer: string }>
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)

  const questions = quiz.questions
  const total = questions.length

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId.toString()]: answer }))
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < total) return
    setSubmitting(true)
    try {
      const res = await submitQuiz(lessonId, answers)
      setResult(res)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setAnswers({})
    setResult(null)
    setCurrentQ(0)
  }

  if (result) {
    return (
      <div className="max-w-lg mx-auto text-center py-8">
        <TrophyIcon className={`h-16 w-16 mx-auto mb-4 ${result.passed ? 'text-yellow-400' : 'text-gray-300'}`} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Тест завершён!</h3>
        <div className="mb-4">
          <ScoreBadge score={result.score} />
        </div>
        <p className="text-gray-600 mb-6">
          Правильных ответов: <strong>{result.correct}</strong> из <strong>{result.total}</strong>
        </p>

        {result.passed && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            Поздравляем! Следующий урок разблокирован!
          </div>
        )}

        <div className="text-left space-y-3 mb-6">
          {questions.map((q, i) => {
            const qResult = result.results[q.id.toString()]
            return (
              <div
                key={q.id}
                className={`p-3 rounded-lg border text-sm ${
                  qResult?.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {qResult?.correct ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{i + 1}. {q.textRu}</p>
                    <p className="text-gray-600 mt-0.5">
                      Ваш ответ: <span className={qResult?.correct ? 'text-green-700' : 'text-red-700'}>{answers[q.id.toString()]}</span>
                    </p>
                    {!qResult?.correct && (
                      <p className="text-green-700 mt-0.5">Правильно: {qResult?.correctAnswer}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={reset} className="btn-secondary">
          Пройти снова
        </button>
      </div>
    )
  }

  const q = questions[currentQ]
  const answeredCount = Object.keys(answers).length

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">Вопрос {currentQ + 1} из {total}</span>
        <span className="text-sm text-gray-500">{answeredCount} отвечено</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-teal-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((currentQ + 1) / total) * 100}%` }}
        />
      </div>

      {existingBestScore !== undefined && existingBestScore > 0 && (
        <div className="mb-4 text-xs text-gray-500 text-center">
          Лучший результат: <ScoreBadge score={existingBestScore} />
        </div>
      )}

      {/* Question card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <p className="text-xs text-gray-500 mb-1">Вопрос {currentQ + 1}</p>
        <p className="font-semibold text-gray-900 mb-1">{q.textRu}</p>
        <p className="text-sm text-teal-600 mb-4">{q.textKz}</p>

        <div className="space-y-2">
          {(q.options as string[]).map((opt) => {
            const isSelected = answers[q.id.toString()] === opt
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(q.id, opt)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-gray-700'
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        {currentQ > 0 && (
          <button
            onClick={() => setCurrentQ(currentQ - 1)}
            className="btn-secondary text-sm"
          >
            Назад
          </button>
        )}
        <div className="flex-1" />
        {currentQ < total - 1 ? (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            disabled={!answers[q.id.toString()]}
            className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
          >
            Далее <ArrowRightIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < total || submitting}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {submitting ? 'Проверяем...' : `Завершить тест (${answeredCount}/${total})`}
          </button>
        )}
      </div>
    </div>
  )
}
