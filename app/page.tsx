import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Redirect based on user role
  switch (session.user.role) {
    case UserRole.MANAGER:
      redirect('/dashboard/manager')
    case UserRole.WORKER:
      redirect('/dashboard/worker')
    case UserRole.CLIENT:
      redirect('/dashboard/client')
    default:
      redirect('/auth/signin')
  }
}
