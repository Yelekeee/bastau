import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const router = Router()

router.use(authMiddleware)

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { number: 'asc' },
      include: {
        progress: {
          where: { userId: req.user!.id },
          select: { bestScore: true, attempts: true, completed: true },
        },
      },
    })

    const result = lessons.map((l) => ({
      id: l.id,
      number: l.number,
      titleKz: l.titleKz,
      titleRu: l.titleRu,
      grammarTopic: l.grammarTopic,
      hoursEstimate: l.hoursEstimate,
      progress: l.progress[0] ?? null,
    }))

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const lessonId = parseInt(req.params.id)

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        exercises: true,
        quiz: {
          include: { questions: true },
        },
        progress: {
          where: { userId: req.user!.id },
        },
      },
    })

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' })
      return
    }

    res.json({
      ...lesson,
      progress: lesson.progress[0] ?? null,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
