import { auth } from './auth'
import { UserRole } from '@prisma/client'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireAuth()
  const roles = Array.isArray(role) ? role : [role]
  
  if (!roles.includes(user.role)) {
    throw new Error('Forbidden: Insufficient permissions')
  }
  
  return user
}

export async function isManager() {
  const user = await getCurrentUser()
  return user?.role === UserRole.MANAGER
}

export async function isWorker() {
  const user = await getCurrentUser()
  return user?.role === UserRole.WORKER
}

export async function isClient() {
  const user = await getCurrentUser()
  return user?.role === UserRole.CLIENT
}
