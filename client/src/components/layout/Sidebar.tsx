import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { to: '/course', icon: HomeIcon, label: 'Курс' },
  { to: '/stats', icon: ChartBarIcon, label: 'Статистика' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 py-6">
      <div className="px-4 mb-8">
        <h1 className="text-2xl font-bold text-teal-600">Бастау</h1>
        <p className="text-xs text-gray-500 mt-1">Казахский язык</p>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 mt-auto">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Cog6ToothIcon className="h-5 w-5" />
          Настройки
        </NavLink>
      </div>
    </aside>
  )
}
