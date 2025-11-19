import React, { useState } from 'react'
import client from '../api'
import { validatePhone10, validateEmail } from '../utils/validators'
import { useToast } from './Toast'

export default function ReferralForm({ onAdded }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    
    if (!name) return toast.push('Name is required', 'error');
    const emailErr = validateEmail(email);
    if (emailErr) return toast.push(emailErr, 'error');
    const phoneErr = validatePhone10(phone);
    if (phoneErr) return toast.push(phoneErr, 'error');
    if (!jobTitle) return toast.push('Job title is required', 'error');
    if (resume && resume.type !== 'application/pdf') 
      return toast.push('Resume must be PDF', 'error');
  
    setSaving(true);
  
    try {
      const form = new FormData();
      form.append('name', name);
      form.append('email', email);
      form.append('phone', phone);
      form.append('jobTitle', jobTitle);
      if (resume) form.append('resume', resume);
  
      const res = await client.post('/candidates', form);
  
      toast.push('Referral submitted', 'success');
      onAdded?.(res.data);
  
      setName('');
      setEmail('');
      setPhone('');
      setJobTitle('');
      setResume(null);
  
    } catch (error) {
      toast.push(error.response?.data?.message || 'Submit failed', 'error');
    } finally {
      setSaving(false);
    }
  };
  

  return (
    <form onSubmit={submit} className="card">
      <h3 className="font-semibold mb-2">Refer a candidate</h3>
      <div className="grid grid-cols-1 gap-3">
        <input placeholder="Candidate name" value={name} onChange={e=>setName(e.target.value)} required className="p-2 border rounded" />
        <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="p-2 border rounded" />
        <input placeholder="Phone (10 digits)" value={phone} onChange={e=>setPhone(e.target.value)} required className="p-2 border rounded" />
        <input placeholder="Job title" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} required className="p-2 border rounded" />
        <input type="file" accept="application/pdf" onChange={e=>setResume(e.target.files[0])} className="p-1" />
        <div className="flex justify-end">
          <button type="submit" className="btn bg-sky-600 text-white" disabled={saving}>{saving ? 'Submitting...' : 'Refer'}</button>
        </div>
      </div>
    </form>
  )
}
