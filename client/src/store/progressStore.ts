import { create } from 'zustand'
import apiClient from '../api/client'
import { LessonSummary, Lesson, QuizSubmitResult, StatsResponse } from '../types'

interface ProgressState {
  lessons: LessonSummary[]
  currentLesson: Lesson | null
  stats: StatsResponse | null
  loading: boolean
  fetchLessons: () => Promise<void>
  fetchLesson: (id: number) => Promise<void>
  submitQuiz: (lessonId: number, answers: Record<string, string>) => Promise<QuizSubmitResult>
  fetchStats: () => Promise<void>
}

export const useProgressStore = create<ProgressState>((set) => ({
  lessons: [],
  currentLesson: null,
  stats: null,
  loading: false,

  fetchLessons: async () => {
    set({ loading: true })
    try {
      const res = await apiClient.get('/api/lessons')
      set({ lessons: res.data })
    } finally {
      set({ loading: false })
    }
  },

  fetchLesson: async (id) => {
    set({ loading: true })
    try {
      const res = await apiClient.get(`/api/lessons/${id}`)
      set({ currentLesson: res.data })
    } finally {
      set({ loading: false })
    }
  },

  submitQuiz: async (lessonId, answers) => {
    const res = await apiClient.post(`/api/quiz/${lessonId}/submit`, { answers })
    // Refresh lessons to update progress
    const lessonsRes = await apiClient.get('/api/lessons')
    set({ lessons: lessonsRes.data })
    return res.data as QuizSubmitResult
  },

  fetchStats: async () => {
    const res = await apiClient.get('/api/stats')
    set({ stats: res.data })
  },
}))
