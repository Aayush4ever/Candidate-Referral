import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../utils/auth'

export default function AdminNavbar({ user, onLogout }) {
  return (
    <nav className="bg-white shadow mb-4">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/admin/dashboard" className="font-semibold">Dashboard</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">{user?.name || user?.email}</div>
          <button className="btn bg-red-600 text-white" onClick={() => { logout(); onLogout && onLogout() }}>Logout</button>
        </div>
      </div>
    </nav>
  )
}
