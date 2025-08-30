'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewPayer() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/payers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    router.push('/super/dashboard/payers')
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md space-y-4">
      <h1 className="text-xl font-bold">Create New Payer</h1>
      <input
        className="border p-2 w-full"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. Aetna"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Create</button>
    </form>
  )
}
