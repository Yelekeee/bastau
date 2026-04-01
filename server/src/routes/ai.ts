import { Router, Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Ты — дружелюбный AI-помощник платформы "Бастау" для изучения казахского языка.
Твоя задача — помогать студентам практиковать казахский язык.

Правила:
1. Всегда отвечай на ДВУХ языках: сначала по-казахски, потом перевод на русский
2. Объясняй грамматику понятно, с примерами аффиксов
3. Исправляй ошибки вежливо и объясняй правило
4. Если просят диалог — составь реалистичный диалог на казахском с переводом
5. Используй примеры из повседневной жизни Казахстана
6. Будь терпелив и поощряй студентов

Формат для аффиксов и примеров:
- Казахский текст **жирным**
- Аффикс подчёркивай или выдели
- Перевод в скобках или на новой строке

Начинай каждый ответ с краткой казахской фразы (приветствие или поощрение).`

router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { messages } = req.body as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  }

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Messages array is required' })
    return
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      res.status(500).json({ error: 'Unexpected response type' })
      return
    }

    res.json({ message: content.text })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'AI service error' })
  }
})

export default router
