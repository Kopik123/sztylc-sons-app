'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ManagerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('quotes')
  const [quotes, setQuotes] = useState([])
  const [jobs, setJobs] = useState([])
  const [shifts, setShifts] = useState([])
  const [workers, setWorkers] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user.role !== 'MANAGER') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [quotesRes, jobsRes, shiftsRes] = await Promise.all([
        fetch('/api/quotes'),
        fetch('/api/jobs'),
        fetch('/api/shifts'),
      ])

      if (quotesRes.ok) setQuotes(await quotesRes.json())
      if (jobsRes.ok) setJobs(await jobsRes.json())
      if (shiftsRes.ok) setShifts(await shiftsRes.json())
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const approveShift = async (shiftId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/shifts/${shiftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to approve shift:', error)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const pendingShifts = shifts.filter((s: any) => s.status === 'SUBMITTED')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sztylc & Sons - Manager Portal</h1>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Quote Requests</div>
            <div className="text-3xl font-bold text-gray-900">{quotes.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Active Jobs</div>
            <div className="text-3xl font-bold text-gray-900">
              {jobs.filter((j: any) => j.status === 'IN_PROGRESS' || j.status === 'SCHEDULED').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Pending Approvals</div>
            <div className="text-3xl font-bold text-yellow-600">{pendingShifts.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Jobs</div>
            <div className="text-3xl font-bold text-gray-900">{jobs.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['quotes', 'jobs', 'shifts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'shifts' && pendingShifts.length > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      {pendingShifts.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Quote Requests */}
            {activeTab === 'quotes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4">Quote Requests</h3>
                {quotes.length === 0 ? (
                  <p className="text-gray-500">No quote requests</p>
                ) : (
                  quotes.map((quote: any) => (
                    <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{quote.title}</h4>
                          <p className="text-gray-600 mt-1">{quote.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>Client: {quote.client.name} ({quote.client.email})</p>
                            {quote.location && <p>📍 {quote.location}</p>}
                            {quote.contactInfo && <p>📞 {quote.contactInfo}</p>}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Submitted {new Date(quote.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm ${
                          quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                      {quote.jobs && quote.jobs.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm font-medium">Related Jobs:</p>
                          {quote.jobs.map((job: any) => (
                            <span key={job.id} className="inline-block mt-1 mr-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {job.title} ({job.status})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Jobs */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4">Jobs</h3>
                {jobs.length === 0 ? (
                  <p className="text-gray-500">No jobs created yet</p>
                ) : (
                  jobs.map((job: any) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{job.title}</h4>
                          <p className="text-gray-600 mt-1">{job.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>📍 {job.location}</p>
                            {job.estimatedHours && <p>⏱ Estimated: {job.estimatedHours}h</p>}
                            {job.startDate && (
                              <p>📅 {new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Ongoing'}</p>
                            )}
                          </div>
                          {job.assignments && job.assignments.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Assigned Workers:</p>
                              {job.assignments.map((a: any) => (
                                <span key={a.id} className="inline-block mt-1 mr-2 px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                                  {a.worker.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded text-sm ${
                          job.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
                          job.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                          job.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Shifts Pending Approval */}
            {activeTab === 'shifts' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4">Shift Submissions</h3>
                {shifts.length === 0 ? (
                  <p className="text-gray-500">No shift submissions yet</p>
                ) : (
                  shifts.map((shift: any) => (
                    <div key={shift.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{shift.worker.name}</h4>
                          <p className="text-sm text-gray-600">{shift.assignment.job.title}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>📅 Date: {new Date(shift.date).toLocaleDateString()}</p>
                            <p>⏱ Hours: {shift.hoursWorked}</p>
                            {shift.notes && <p className="mt-1">Note: {shift.notes}</p>}
                            <p className="mt-1">
                              Photos: {shift.photoUrls.length} attached
                              {shift.photoUrls.map((url: string, i: number) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline text-xs">
                                  View {i + 1}
                                </a>
                              ))}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded text-sm ${
                            shift.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                            shift.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {shift.status}
                          </span>
                          {shift.status === 'SUBMITTED' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => approveShift(shift.id, 'APPROVED')}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => approveShift(shift.id, 'REJECTED')}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {shift.approvedBy && (
                        <p className="text-xs text-gray-400 mt-2">
                          {shift.status === 'APPROVED' ? 'Approved' : 'Rejected'} by {shift.approvedBy.name} on {new Date(shift.approvedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
