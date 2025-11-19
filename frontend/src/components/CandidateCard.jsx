import React from 'react'
import client from '../api'
import { useToast } from './Toast'
import { Link } from 'react-router-dom'

function statusColor(status) {
  switch(status) {
    case 'Pending': return 'bg-gray-200 text-gray-700'
    case 'Reviewed': return 'bg-sky-100 text-sky-700'
    case 'Hired': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-200 text-gray-700'
  }
}

export default function CandidateCard({ candidate, onUpdated, onDeleted }) {
  const toast = useToast()

  const remove = async () => {
    if (!window.confirm('Delete this candidate?')) return
    try {
      await client.delete(`/candidates/${candidate._id}`)
      onDeleted && onDeleted(candidate._id)
      toast.push('Candidate deleted','success')
    } catch (err) { toast.push('Delete failed','error') }
  }

  return (
    <div className="card flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium">{candidate.name}</h3>
        <div className="text-sm text-slate-500">{candidate.jobTitle} • {candidate.email} • {candidate.phone}</div>
        <div className="text-xs mt-2">Referred: {new Date(candidate.createdAt).toLocaleString()}</div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className={`px-3 py-1 rounded-full text-sm ${statusColor(candidate.status)}`}>{candidate.status}</div>
        <div className="flex gap-3 items-center">
          {candidate.resumeUrl && <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-sky-600">Download</a>}
          <Link to={`/admin/status/${candidate._id}`} className="text-sm text-slate-700">Update</Link>
          <button className="text-sm text-red-600" onClick={remove}>Delete</button>
        </div>
      </div>
    </div>
  )
}
