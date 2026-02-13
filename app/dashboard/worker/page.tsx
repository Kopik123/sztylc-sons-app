'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WorkerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assignments, setAssignments] = useState([])
  const [shifts, setShifts] = useState([])
  const [showShiftForm, setShowShiftForm] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState('')
  const [shiftData, setShiftData] = useState({
    date: new Date().toISOString().split('T')[0],
    hoursWorked: 8,
    photoUrls: ['https://via.placeholder.com/400'],
    notes: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user.role !== 'WORKER') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    fetchAssignments()
    fetchShifts()
  }, [])

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments')
      if (res.ok) {
        const data = await res.json()
        setAssignments(data)
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
    }
  }

  const fetchShifts = async () => {
    try {
      const res = await fetch('/api/shifts')
      if (res.ok) {
        const data = await res.json()
        setShifts(data)
      }
    } catch (error) {
      console.error('Failed to fetch shifts:', error)
    }
  }

  const handleSubmitShift = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: selectedAssignment,
          ...shiftData,
        }),
      })

      if (res.ok) {
        setShowShiftForm(false)
        setSelectedAssignment('')
        setShiftData({
          date: new Date().toISOString().split('T')[0],
          hoursWorked: 8,
          photoUrls: ['https://via.placeholder.com/400'],
          notes: '',
        })
        fetchShifts()
      }
    } catch (error) {
      console.error('Failed to submit shift:', error)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sztylc & Sons - Worker Portal</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session?.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assignments */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">My Assignments</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {assignments.length === 0 ? (
                <p className="px-6 py-4 text-gray-500">No assignments yet</p>
              ) : (
                assignments.map((assignment: any) => (
                  <div key={assignment.id} className="px-6 py-4">
                    <h3 className="font-semibold">{assignment.job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">📍 {assignment.job.location}</p>
                    <p className="text-sm text-gray-600">
                      Week: {new Date(assignment.weekStart).toLocaleDateString()} - {new Date(assignment.weekEnd).toLocaleDateString()}
                    </p>
                    {assignment.notes && (
                      <p className="text-sm text-gray-500 mt-1">{assignment.notes}</p>
                    )}
                    <button
                      onClick={() => {
                        setSelectedAssignment(assignment.id)
                        setShowShiftForm(true)
                      }}
                      className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Submit Shift
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Shift Submission Form */}
          {showShiftForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Submit Shift</h2>
              <form onSubmit={handleSubmitShift} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    value={shiftData.date}
                    onChange={(e) => setShiftData({ ...shiftData, date: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hours Worked</label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    min="0"
                    max="24"
                    value={shiftData.hoursWorked}
                    onChange={(e) => setShiftData({ ...shiftData, hoursWorked: parseFloat(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Photo URL (placeholder)</label>
                  <input
                    type="url"
                    required
                    value={shiftData.photoUrls[0]}
                    onChange={(e) => setShiftData({ ...shiftData, photoUrls: [e.target.value] })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">In production, this would be a file upload</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={shiftData.notes}
                    onChange={(e) => setShiftData({ ...shiftData, notes: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Submit Shift
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowShiftForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Submitted Shifts */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">My Shifts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {shifts.length === 0 ? (
              <p className="px-6 py-4 text-gray-500">No shifts submitted yet</p>
            ) : (
              shifts.map((shift: any) => (
                <div key={shift.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{shift.assignment.job.title}</h3>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(shift.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Hours: {shift.hoursWorked}</p>
                      {shift.notes && <p className="text-sm text-gray-500 mt-1">{shift.notes}</p>}
                    </div>
                    <span className={`px-3 py-1 rounded text-sm ${
                      shift.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                      shift.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {shift.status}
                    </span>
                  </div>
                  {shift.approvedBy && (
                    <p className="text-xs text-gray-400 mt-2">
                      Approved by {shift.approvedBy.name} on {new Date(shift.approvedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
