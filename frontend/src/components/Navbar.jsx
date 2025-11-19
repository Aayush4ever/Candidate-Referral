import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-lg">CandidateReferral</Link>
          <Link to="/refer" className="text-sm text-slate-600">Refer a candidate</Link>
        </div>
        <div>
          <Link to="/admin/login" className="text-sm text-slate-700">Admin Login</Link>
        </div>
      </div>
    </nav>
  )
}
