import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/session'
import { UserRole } from '@prisma/client'
import { getWeekBounds } from '@/lib/utils'

const assignmentSchema = z.object({
  jobId: z.string(),
  workerId: z.string(),
  weekStart: z.string(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(UserRole.MANAGER)
    const body = await req.json()
    const validatedData = assignmentSchema.parse(body)

    const weekStart = new Date(validatedData.weekStart)
    const { weekEnd } = getWeekBounds(weekStart)

    const assignment = await prisma.assignment.create({
      data: {
        jobId: validatedData.jobId,
        workerId: validatedData.workerId,
        weekStart,
        weekEnd,
        notes: validatedData.notes,
      },
    })

    return NextResponse.json(assignment, { status: 201 })
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
    const user = await requireRole([UserRole.MANAGER, UserRole.WORKER])
    
    const where = user.role === UserRole.WORKER ? { workerId: user.id } : {}
    
    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        job: {
          select: { id: true, title: true, location: true, status: true }
        },
        worker: {
          select: { id: true, name: true, email: true }
        },
        shifts: {
          select: { id: true, date: true, hoursWorked: true, status: true }
        }
      },
      orderBy: { weekStart: 'desc' }
    })

    return NextResponse.json(assignments)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
