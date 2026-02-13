import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Manager user
  const managerPassword = await bcrypt.hash('manager123', 10)
  const manager = await prisma.user.upsert({
    where: { email: 'manager@sztylc.com' },
    update: {},
    create: {
      email: 'manager@sztylc.com',
      name: 'John Manager',
      password: managerPassword,
      role: UserRole.MANAGER,
    },
  })
  console.log('✓ Created manager:', manager.email)

  // Create Worker users
  const workerPassword = await bcrypt.hash('worker123', 10)
  const worker1 = await prisma.user.upsert({
    where: { email: 'worker1@sztylc.com' },
    update: {},
    create: {
      email: 'worker1@sztylc.com',
      name: 'Mike Worker',
      password: workerPassword,
      role: UserRole.WORKER,
    },
  })
  console.log('✓ Created worker:', worker1.email)

  const worker2 = await prisma.user.upsert({
    where: { email: 'worker2@sztylc.com' },
    update: {},
    create: {
      email: 'worker2@sztylc.com',
      name: 'Sarah Worker',
      password: workerPassword,
      role: UserRole.WORKER,
    },
  })
  console.log('✓ Created worker:', worker2.email)

  // Create Client user
  const clientPassword = await bcrypt.hash('client123', 10)
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'Jane Client',
      password: clientPassword,
      role: UserRole.CLIENT,
    },
  })
  console.log('✓ Created client:', client.email)

  // Create sample quote request
  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      clientId: client.id,
      title: 'Kitchen Renovation',
      description: 'Need complete kitchen renovation including cabinets, countertops, and flooring.',
      location: '123 Main St, London',
      contactInfo: '+44 20 1234 5678',
      status: 'pending',
    },
  })
  console.log('✓ Created quote request:', quoteRequest.title)

  // Create sample job
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 7) // Next week
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 14) // 2 weeks duration

  const job = await prisma.job.create({
    data: {
      quoteRequestId: quoteRequest.id,
      managerId: manager.id,
      title: 'Kitchen Renovation - 123 Main St',
      description: 'Complete kitchen renovation project',
      location: '123 Main St, London',
      status: 'SCHEDULED',
      startDate,
      endDate,
      estimatedHours: 80,
    },
  })
  console.log('✓ Created job:', job.title)

  // Create weekly assignment for workers
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1) // Start of current week (Monday)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6) // End of week (Sunday)

  const assignment1 = await prisma.assignment.create({
    data: {
      jobId: job.id,
      workerId: worker1.id,
      weekStart,
      weekEnd,
      notes: 'Main carpenter for kitchen cabinets',
    },
  })
  console.log('✓ Created assignment for:', worker1.name)

  const assignment2 = await prisma.assignment.create({
    data: {
      jobId: job.id,
      workerId: worker2.id,
      weekStart,
      weekEnd,
      notes: 'Assistant for flooring and finishing',
    },
  })
  console.log('✓ Created assignment for:', worker2.name)

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📝 Test credentials:')
  console.log('Manager: manager@sztylc.com / manager123')
  console.log('Worker 1: worker1@sztylc.com / worker123')
  console.log('Worker 2: worker2@sztylc.com / worker123')
  console.log('Client: client@example.com / client123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
