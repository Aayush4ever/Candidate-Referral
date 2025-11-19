import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api'
import AdminNavbar from '../components/AdminNavbar'
import { useToast } from '../components/Toast'

export default function UpdateStatusPage({ user }) {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const toast = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.get('/candidates')
        const found = res.data.find(x => x._id === id)
        if (!found) { toast.push('Candidate not found', 'error'); nav('/admin/dashboard'); return }
        setCandidate(found)
        setStatus(found.status)
      } catch (err) { toast.push('Error loading', 'error'); nav('/admin/dashboard') }
    }
    load()
  }, [id])

  const save = async () => {
    setLoading(true)
    try {
      await client.put(`/candidates/${id}/status`, { status })
      toast.push('Status updated', 'success')
      nav('/admin/dashboard')
    } catch (err) { toast.push('Update failed', 'error') }
    finally { setLoading(false) }
  }

  if (!candidate) return null

  return (
    <div>
      <AdminNavbar user={user} />
      <div className="max-w-3xl mx-auto p-6">
        <div className="card">
          <h2 className="text-xl font-semibold">Update Status</h2>
          <div className="mt-3">
            <div className="text-sm text-slate-600">Candidate: <strong>{candidate.name}</strong></div>
            <div className="mt-3">
              <select value={status} onChange={e=>setStatus(e.target.value)} className="p-2 border rounded-md">
                <option>Pending</option>
                <option>Reviewed</option>
                <option>Hired</option>
              </select>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button className="btn bg-sky-600 text-white" onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button className="btn" onClick={() => window.history.back()}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
