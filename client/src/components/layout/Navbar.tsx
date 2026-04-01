import { useNavigate } from 'react-router-dom'
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 md:px-6">
      <div className="md:hidden">
        <h1 className="text-xl font-bold text-teal-600">Бастау</h1>
      </div>

      <div className="flex-1 md:flex-none" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <UserCircleIcon className="h-6 w-6 text-gray-400" />
          <span className="hidden sm:block font-medium">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
          title="Выйти"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="hidden sm:block">Выйти</span>
        </button>
      </div>
    </header>
  )
}
