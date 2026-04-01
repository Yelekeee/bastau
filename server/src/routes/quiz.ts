import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const router = Router()

router.use(authMiddleware)

router.post('/:lessonId/submit', async (req: AuthRequest, res: Response): Promise<void> => {
  const lessonId = parseInt(req.params.lessonId)
  const { answers } = req.body as { answers: Record<string, string> }
  const userId = req.user!.id

  if (!answers) {
    res.status(400).json({ error: 'Answers are required' })
    return
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { lessonId },
      include: { questions: true },
    })

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found for this lesson' })
      return
    }

    let correct = 0
    const total = quiz.questions.length
    const results: Record<string, { correct: boolean; correctAnswer: string }> = {}

    for (const q of quiz.questions) {
      const userAnswer = answers[q.id.toString()]
      const isCorrect = userAnswer === q.correctAnswer
      if (isCorrect) correct++
      results[q.id] = { correct: isCorrect, correctAnswer: q.correctAnswer }
    }

    const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0
    const passed = scorePercent >= 80

    // Upsert UserProgress
    const existing = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    })

    const newBestScore = existing ? Math.max(existing.bestScore, scorePercent) : scorePercent
    const completed = passed || (existing?.completed ?? false)

    await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        bestScore: newBestScore,
        attempts: { increment: 1 },
        completed,
      },
      create: {
        userId,
        lessonId,
        bestScore: scorePercent,
        attempts: 1,
        completed,
      },
    })

    // Update streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = await prisma.userStats.findUnique({ where: { userId } })
    if (stats) {
      const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate) : null
      if (lastActive) lastActive.setHours(0, 0, 0, 0)

      const isToday = lastActive?.getTime() === today.getTime()
      const isYesterday = lastActive
        ? today.getTime() - lastActive.getTime() === 86400000
        : false

      let newStreak = stats.streak
      if (!isToday) {
        newStreak = isYesterday ? stats.streak + 1 : 1
      }

      await prisma.userStats.update({
        where: { userId },
        data: {
          streak: newStreak,
          lastActiveDate: today,
        },
      })
    }

    res.json({
      score: scorePercent,
      correct,
      total,
      passed,
      results,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
