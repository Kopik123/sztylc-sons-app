import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/session'
import { UserRole, ShiftStatus } from '@prisma/client'
import { calculatePayroll, getWeekBounds } from '@/lib/utils'

const approvalSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(UserRole.MANAGER)
    const { id } = await params
    const body = await req.json()
    const { status } = approvalSchema.parse(body)

    const shift = await prisma.shiftSubmission.findUnique({
      where: { id },
    })

    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 })
    }

    const updatedShift = await prisma.shiftSubmission.update({
      where: { id },
      data: {
        status: status as ShiftStatus,
        approvedById: user.id,
        approvedAt: new Date(),
      },
    })

    // If approved, create payroll entry
    if (status === 'APPROVED') {
      const { weekStart, weekEnd } = getWeekBounds(shift.date)
      const { totalAmount } = calculatePayroll(shift.hoursWorked)

      await prisma.payroll.create({
        data: {
          shiftId: shift.id,
          workerId: shift.workerId,
          weekStart,
          weekEnd,
          hoursWorked: shift.hoursWorked,
          fullDayRate: parseFloat(process.env.FULL_DAY_RATE || '120'),
          totalAmount,
        },
      })
    }

    return NextResponse.json(updatedShift)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
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
