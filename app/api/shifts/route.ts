import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/session'
import { UserRole, ShiftStatus } from '@prisma/client'

const shiftSchema = z.object({
  assignmentId: z.string(),
  date: z.string(),
  hoursWorked: z.number().positive().max(24),
  photoUrls: z.array(z.string().url()).min(1, 'At least one photo is required'),
  notes: z.string().optional(),
})

const approvalSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
})

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(UserRole.WORKER)
    const body = await req.json()
    const validatedData = shiftSchema.parse(body)

    const shift = await prisma.shiftSubmission.create({
      data: {
        assignmentId: validatedData.assignmentId,
        workerId: user.id,
        date: new Date(validatedData.date),
        hoursWorked: validatedData.hoursWorked,
        photoUrls: validatedData.photoUrls,
        notes: validatedData.notes,
        status: ShiftStatus.SUBMITTED,
      },
    })

    return NextResponse.json(shift, { status: 201 })
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
    
    const shifts = await prisma.shiftSubmission.findMany({
      where,
      include: {
        assignment: {
          include: {
            job: {
              select: { id: true, title: true, location: true }
            }
          }
        },
        worker: {
          select: { id: true, name: true, email: true }
        },
        approvedBy: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(shifts)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
