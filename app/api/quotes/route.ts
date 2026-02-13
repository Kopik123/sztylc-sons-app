import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/session'
import { UserRole } from '@prisma/client'

const quoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().optional(),
  contactInfo: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(UserRole.CLIENT)
    const body = await req.json()
    const validatedData = quoteSchema.parse(body)

    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        clientId: user.id,
        ...validatedData,
        status: 'pending',
      },
    })

    return NextResponse.json(quoteRequest, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.CLIENT, UserRole.MANAGER])
    
    const where = user.role === UserRole.CLIENT ? { clientId: user.id } : {}
    
    const quotes = await prisma.quoteRequest.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        jobs: {
          select: { id: true, title: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(quotes)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
