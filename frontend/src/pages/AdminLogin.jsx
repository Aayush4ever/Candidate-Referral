import React, { useState } from 'react'
import client from '../api'
import { saveAuth } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import Navbar from '../components/Navbar'

export default function AdminLogin({ onAuthChange }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const res = await client.post('/auth/login', { email, password })
      saveAuth(res.data.token, res.data.user)
      onAuthChange && onAuthChange()
      toast.push('Logged in', 'success')
      nav('/admin/dashboard')
    } catch (error) {
      const m = error.response?.data?.message || 'Login failed'
      setErr(m)
      toast.push(m, 'error')
    } finally { setLoading(false) }
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Admin Login</h2>
          <p className="text-sm text-slate-500 mb-4">Use your admin credentials to manage referrals.</p>
          {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div className="flex justify-end">
              <button className="btn bg-sky-600 text-white" type="submit" disabled={loading}>{loading ? 'Logging...' : 'Login'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
