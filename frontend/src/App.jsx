import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ReferPage from './pages/ReferPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UpdateStatusPage from './pages/UpdateStatusPage'
import { isLoggedIn, getUser } from './utils/auth'

function RequireAuth({ children }) {
  const auth = isLoggedIn()
  const location = useLocation()
  if (!auth) return <Navigate to="/admin/login" state={{ from: location }} replace />
  return children
}

export default function App() {
  const [auth, setAuth] = useState(isLoggedIn())
  const [user, setUser] = useState(getUser())

  useEffect(() => {
    setAuth(isLoggedIn())
    setUser(getUser())
  }, [])

  return (
    <Routes>
      <Route path="/refer" element={<ReferPage />} />
      <Route path="/admin/login" element={<AdminLogin onAuthChange={() => { setAuth(isLoggedIn()); setUser(getUser()) }} />} />

      <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboard user={user} onAuthChange={() => { setAuth(isLoggedIn()); setUser(getUser()) }} /></RequireAuth>} />
      <Route path="/admin/status/:id" element={<RequireAuth><UpdateStatusPage user={user} /></RequireAuth>} />

      <Route path="/" element={<Navigate to="/refer" replace />} />
      <Route path="*" element={<Navigate to="/refer" replace />} />
    </Routes>
  )
}
