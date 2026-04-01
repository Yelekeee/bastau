import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '../api/client'
import { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, nativeLang: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const res = await apiClient.post('/api/auth/login', { email, password })
        const { token, user } = res.data
        localStorage.setItem('token', token)
        set({ user, token })
      },

      register: async (name, email, password, nativeLang) => {
        const res = await apiClient.post('/api/auth/register', { name, email, password, nativeLang })
        const { token, user } = res.data
        localStorage.setItem('token', token)
        set({ user, token })
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },
    }),
    {
      name: 'bastau-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
