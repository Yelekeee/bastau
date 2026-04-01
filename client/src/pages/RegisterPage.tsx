import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const NATIVE_LANGS = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'kz', label: 'Қазақша' },
  { value: 'zh', label: '中文' },
  { value: 'other', label: 'Другой' },
]

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nativeLang, setNativeLang] = useState('ru')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password, nativeLang)
      navigate('/course')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr?.response?.data?.error ?? 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-600 mb-2">Бастау</h1>
          <p className="text-gray-600">Начни изучать казахский сегодня</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Регистрация</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Ваше имя"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Минимум 6 символов"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Родной язык
              </label>
              <select
                value={nativeLang}
                onChange={(e) => setNativeLang(e.target.value)}
                className="input-field"
              >
                {NATIVE_LANGS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Создаём аккаунт...' : 'Создать аккаунт'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-teal-600 hover:underline font-medium">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
