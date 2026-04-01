export interface User {
  id: number
  name: string
  email: string
  nativeLang: string
}

export interface UserProgress {
  id: number
  userId: number
  lessonId: number
  bestScore: number
  attempts: number
  completed: boolean
  updatedAt: string
}

export interface UserStats {
  streak: number
  lastActiveDate: string | null
  totalHours: number
}

export interface Phrase {
  kz: string
  ru: string
}

export interface Lesson {
  id: number
  number: number
  titleKz: string
  titleRu: string
  grammarTopic: string
  hoursEstimate: number
  theoryKz: string
  theoryRu: string
  dialogueKz: string
  dialogueRu: string
  phrases: Phrase[]
  exercises?: Exercise[]
  quiz?: Quiz
  progress?: UserProgress | null
}

export interface Exercise {
  id: number
  lessonId: number
  type: 'FILL_BLANK' | 'MATCH' | 'BUILD_SENTENCE'
  prompt: string
  options: string[] | Record<string, string>
  answer: string
}

export interface Question {
  id: number
  quizId: number
  textKz: string
  textRu: string
  options: string[]
  correctAnswer: string
}

export interface Quiz {
  id: number
  lessonId: number
  questions: Question[]
}

export interface LessonSummary {
  id: number
  number: number
  titleKz: string
  titleRu: string
  grammarTopic: string
  hoursEstimate: number
  progress: UserProgress | null
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface QuizSubmitResult {
  score: number
  correct: number
  total: number
  passed: boolean
  results: Record<string, { correct: boolean; correctAnswer: string }>
}

export interface StatsResponse {
  progress: Array<UserProgress & { lesson: Pick<Lesson, 'id' | 'number' | 'titleKz' | 'titleRu'> }>
  stats: UserStats
  totalLessons: number
  completedCount: number
}
