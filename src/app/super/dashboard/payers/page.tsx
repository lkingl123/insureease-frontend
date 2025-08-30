'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PayersPage() {
  const [payers, setPayers] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/payers')
      .then(res => res.json())
      .then(setPayers)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payer Library</h1>
      <Link href="/super/dashboard/payers/new" className="text-blue-600 underline">+ Add Payer</Link>
      <ul className="mt-4 space-y-2">
        {payers.map(p => (
          <li key={p.id}>
            <Link href={`/super/dashboard/payers/${p.id}`} className="text-lg font-medium text-blue-700 hover:underline">
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
