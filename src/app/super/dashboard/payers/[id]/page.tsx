'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { FullPayer } from '@/types/payer'
import type { PayerContact } from '@prisma/client'

export default function PayerDetail() {
  const { id } = useParams()
  const [payer, setPayer] = useState<FullPayer | null>(null)
  const [productName, setProductName] = useState('')
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    fax: '',
  })

  useEffect(() => {
    fetch('/api/payers')
      .then(res => res.json())
      .then((data: FullPayer[]) => {
        const match = data.find(p => p.id === id)
        setPayer(match || null)
      })
  }, [id])

  const addProduct = async () => {
    await fetch(`/api/payers/${id}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: productName }),
    })
    setProductName('')
    location.reload()
  }

  const addContact = async () => {
    await fetch(`/api/payers/${id}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    })
    setContact({ name: '', email: '', phone: '', fax: '' })
    location.reload()
  }

  if (!payer) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Payer: {payer.name}</h1>

      <div>
        <h2 className="font-semibold">Products</h2>
        <ul>
          {payer.products?.map(product => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
        <input
          className="border p-1 mt-2"
          value={productName}
          onChange={e => setProductName(e.target.value)}
          placeholder="Add product"
        />
        <button onClick={addProduct} className="ml-2 px-2 py-1 bg-green-600 text-white">
          + Add
        </button>
      </div>

      <div>
        <h2 className="font-semibold">Contacts</h2>
        <ul>
          {payer.contacts?.map((c: PayerContact) => (
            <li key={c.id}>
              {c.name} — {c.email ?? c.phone ?? c.fax}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <input className="border p-1" placeholder="Name" value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))} />
          <input className="border p-1" placeholder="Email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
          <input className="border p-1" placeholder="Phone" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} />
          <input className="border p-1" placeholder="Fax" value={contact.fax} onChange={e => setContact(c => ({ ...c, fax: e.target.value }))} />
        </div>
        <button onClick={addContact} className="mt-2 px-2 py-1 bg-green-600 text-white">+ Add Contact</button>
      </div>
    </div>
  )
}
