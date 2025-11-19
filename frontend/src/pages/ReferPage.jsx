import React from 'react'
import Navbar from '../components/Navbar'
import ReferralForm from '../components/ReferralForm'

export default function ReferPage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-start justify-center p-6">
        <div className="max-w-3xl w-full">
          <div className="card mb-6">
            <h1 className="text-2xl font-semibold">Refer a Candidate</h1>
            <p className="text-sm text-slate-500 mt-1">Fill the form below to refer a candidate. Upload resume (PDF) optionally.</p>
          </div>
          <ReferralForm onAdded={() => { }} />
        </div>
      </div>
    </div>
  )
}
