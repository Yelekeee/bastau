import { useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { FireIcon, TrophyIcon, BookOpenIcon } from '@heroicons/react/24/solid'
import { useProgressStore } from '../store/progressStore'

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 80
      ? 'bg-green-100 text-green-700'
      : score >= 50
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700'
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{score}%</span>
}

function getBarColor(score: number) {
  if (score >= 80) return '#16a34a'
  if (score >= 50) return '#ca8a04'
  return '#dc2626'
}

export default function StatsPage() {
  const { stats, fetchStats } = useProgressStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (!stats) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-teal-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const { progress, stats: userStats, totalLessons, completedCount } = stats
  const overallPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const chartData = progress.map((p) => ({
    lesson: `Урок ${p.lesson.number}`,
    score: p.bestScore,
    name: p.lesson.titleRu,
  }))

  const weakSpots = progress.filter((p) => p.attempts > 0 && p.bestScore < 50)

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Статистика</h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-center shadow-sm">
          <FireIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{userStats.streak}</p>
          <p className="text-sm text-gray-500">дней подряд</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-center shadow-sm">
          <TrophyIcon className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
          <p className="text-sm text-gray-500">уроков завершено</p>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-gray-100 p-5 text-center shadow-sm">
          <BookOpenIcon className="h-8 w-8 text-teal-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{overallPercent}%</p>
          <p className="text-sm text-gray-500">курс пройден</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Общий прогресс</h2>
          <span className="text-sm text-gray-500">{completedCount} / {totalLessons}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-teal-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Результаты по урокам</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="lesson" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: number, _name: string, props) => [
                  `${val}%`,
                  props.payload.name,
                ]}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Per-lesson table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Детальная статистика</h2>
        </div>
        {progress.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm">Вы ещё не проходили уроки.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Урок</th>
                <th className="px-4 py-3 text-left">Тема</th>
                <th className="px-4 py-3 text-center">Лучший</th>
                <th className="px-4 py-3 text-center">Попыток</th>
                <th className="px-4 py-3 text-center">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {progress.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {p.lesson.number}. {p.lesson.titleRu}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.lesson.titleKz}</td>
                  <td className="px-4 py-3 text-center">
                    {p.bestScore > 0 ? <ScoreBadge score={p.bestScore} /> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{p.attempts}</td>
                  <td className="px-4 py-3 text-center">
                    {p.completed ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Завершён</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">В процессе</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Weak spots */}
      {weakSpots.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h2 className="font-semibold text-red-800 mb-3">Слабые места</h2>
          <p className="text-sm text-red-700 mb-2">Рекомендуем повторить эти уроки:</p>
          <ul className="space-y-1">
            {weakSpots.map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-sm text-red-700">
                <span>•</span>
                <span>Урок {p.lesson.number}: {p.lesson.titleRu} ({p.bestScore}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
