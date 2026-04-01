import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const router = Router()

router.use(authMiddleware)

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id

  try {
    const [progress, stats, lessons] = await Promise.all([
      prisma.userProgress.findMany({
        where: { userId },
        include: {
          lesson: {
            select: { id: true, number: true, titleKz: true, titleRu: true },
          },
        },
        orderBy: { lesson: { number: 'asc' } },
      }),
      prisma.userStats.findUnique({ where: { userId } }),
      prisma.lesson.count(),
    ])

    const completedCount = progress.filter((p) => p.completed).length

    res.json({
      progress,
      stats: stats ?? { streak: 0, lastActiveDate: null, totalHours: 0 },
      totalLessons: lessons,
      completedCount,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
