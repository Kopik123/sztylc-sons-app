import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/session'
import { UserRole } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.MANAGER, UserRole.WORKER])
    
    const { searchParams } = new URL(req.url)
    const weekStart = searchParams.get('weekStart')
    const workerId = user.role === UserRole.WORKER ? user.id : searchParams.get('workerId')
    
    const where: any = {}
    if (workerId) {
      where.workerId = workerId
    }
    if (weekStart) {
      where.weekStart = new Date(weekStart)
    }
    
    const payrolls = await prisma.payroll.findMany({
      where,
      include: {
        worker: {
          select: { id: true, name: true, email: true }
        },
        shift: {
          include: {
            assignment: {
              include: {
                job: {
                  select: { id: true, title: true, location: true }
                }
              }
            }
          }
        }
      },
      orderBy: { weekStart: 'desc' }
    })

    return NextResponse.json(payrolls)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
