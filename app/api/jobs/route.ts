import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/session'
import { UserRole, JobStatus } from '@prisma/client'

const jobSchema = z.object({
  quoteRequestId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  status: z.nativeEnum(JobStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedHours: z.number().positive().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(UserRole.MANAGER)
    const body = await req.json()
    const validatedData = jobSchema.parse(body)

    const job = await prisma.job.create({
      data: {
        managerId: user.id,
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      },
    })

    return NextResponse.json(job, { status: 201 })
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
    await requireRole([UserRole.MANAGER, UserRole.WORKER])
    
    const jobs = await prisma.job.findMany({
      include: {
        manager: {
          select: { id: true, name: true, email: true }
        },
        quoteRequest: {
          select: { id: true, title: true }
        },
        assignments: {
          include: {
            worker: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
