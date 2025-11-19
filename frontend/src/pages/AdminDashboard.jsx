import React, { useEffect, useState } from 'react'
import client from '../api'
import CandidateCard from '../components/CandidateCard'
import AdminNavbar from '../components/AdminNavbar'
import { useToast } from '../components/Toast'

export default function AdminDashboard({ user, onAuthChange }) {
  const [candidates, setCandidates] = useState([])
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [metrics, setMetrics] = useState({ total:0, pending:0, reviewed:0, hired:0 })
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const params = {}
      if (q) params.q = q
      if (statusFilter) params.status = statusFilter
      const res = await client.get('/candidates', { params })
      setCandidates(res.data)
    } catch (err) { toast.push('Error fetching candidates','error') }
    finally { setLoading(false) }
  }

  const fetchMetrics = async () => {
    try {
      const res = await client.get('/candidates/metrics/summary')
      setMetrics(res.data)
    } catch (err) { }
  }

  useEffect(() => { fetchCandidates(); fetchMetrics() }, [])

  const handleUpdated = (updated) => {
    setCandidates(prev => prev.map(c => c._id === updated._id ? updated : c))
    fetchMetrics()
    toast.push('Status updated', 'success')
  }

  const handleDeleted = (id) => {
    setCandidates(prev => prev.filter(c => c._id !== id))
    fetchMetrics()
    toast.push('Candidate deleted', 'success')
  }

  return (
    <div>
      <AdminNavbar user={user} onLogout={onAuthChange} />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Candidates</h1>
          <div className="text-sm text-slate-600">Total: <strong>{metrics.total}</strong></div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-4">
            <div className="card mb-4">
              <h3 className="font-semibold">Filters</h3>
              <div className="mt-3 space-y-3">
                <input placeholder="Search name, job or email" value={q} onChange={e=>setQ(e.target.value)} className="w-full p-2 border rounded-md" />
                <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Hired">Hired</option>
                </select>
                <div className="flex gap-2">
                  <button className="btn bg-sky-600 text-white" onClick={fetchCandidates}>Search</button>
                  <button className="btn" onClick={() => { setQ(''); setStatusFilter(''); fetchCandidates(); }}>Reset</button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold">Metrics</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex justify-between"><span>Total</span><strong>{metrics.total}</strong></div>
                <div className="flex justify-between"><span>Pending</span><strong>{metrics.pending}</strong></div>
                <div className="flex justify-between"><span>Reviewed</span><strong>{metrics.reviewed}</strong></div>
                <div className="flex justify-between"><span>Hired</span><strong>{metrics.hired}</strong></div>
              </div>
            </div>
          </aside>

          <main className="col-span-8">
            <div className="space-y-4">
              {loading ? <div className="card">Loading...</div> : (
                candidates.length === 0 ? <div className="card">No candidates yet</div> : (
                  <div className="grid grid-cols-1 gap-4">
                    {candidates.map(c => (
                      <CandidateCard key={c._1d} candidate={c} onUpdated={handleUpdated} onDeleted={handleDeleted} />
                    ))}
                  </div>
                )
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
