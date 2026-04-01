import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth'
import lessonsRoutes from './routes/lessons'
import quizRoutes from './routes/quiz'
import statsRoutes from './routes/stats'
import aiRoutes from './routes/ai'

const app = express()
const PORT = process.env.PORT ?? 5000

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/lessons', lessonsRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/ai', aiRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Бастау server running on http://localhost:${PORT}`)
})
