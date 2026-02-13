export function calculatePayroll(hoursWorked: number): {
  fullDays: number
  remainingHours: number
  totalAmount: number
} {
  const FULL_DAY_HOURS = parseFloat(process.env.FULL_DAY_HOURS || '8')
  const FULL_DAY_RATE = parseFloat(process.env.FULL_DAY_RATE || '120')
  
  const fullDays = Math.floor(hoursWorked / FULL_DAY_HOURS)
  const remainingHours = hoursWorked % FULL_DAY_HOURS
  const hourlyRate = FULL_DAY_RATE / FULL_DAY_HOURS
  
  const totalAmount = (fullDays * FULL_DAY_RATE) + (remainingHours * hourlyRate)
  
  return {
    fullDays,
    remainingHours,
    totalAmount: parseFloat(totalAmount.toFixed(2))
  }
}

export function getWeekBounds(date: Date = new Date()): {
  weekStart: Date
  weekEnd: Date
} {
  const weekStart = new Date(date)
  weekStart.setDate(date.getDate() - date.getDay() + 1) // Monday
  weekStart.setHours(0, 0, 0, 0)
  
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6) // Sunday
  weekEnd.setHours(23, 59, 59, 999)
  
  return { weekStart, weekEnd }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}
