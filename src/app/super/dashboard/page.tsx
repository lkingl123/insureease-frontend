'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Entity = {
  id: string
  name: string
  slug: string
  users?: { id: string }[]
}

export default function Page() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/api/entities', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Entity[]) => setEntities(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return entities
    return entities.filter(e =>
      [e.name, e.slug].some(v => v?.toLowerCase().includes(term))
    )
  }, [entities, q])

  return (
    <div className="space-y-6">
      {/* Search */}
      <section>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search entities by name or slug…"
          className="w-full max-w-md rounded-lg border border-brand-muted/60 bg-white px-3 py-2 text-sm text-brand-gray placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
      </section>

      {/* Entities list */}
      <section className="bg-white rounded-2xl shadow-lg ring-1 ring-brand-muted/40 p-4">
        <h2 className="text-lg font-bold text-brand-gray px-2 pb-2">Entities</h2>

        {loading ? (
          <div className="py-10 text-center text-brand-gray/80">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-brand-gray/70">No entities found.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((e) => (
              <li
                key={e.id}
                className="rounded-xl ring-1 ring-brand-muted/40 bg-white p-4 hover:bg-brand-light/20 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-black">{e.name}</h3>
                    <p className="text-xs text-brand-gray/70">/{e.slug}</p>
                    <p className="mt-1 text-xs text-brand-gray">
                      Users: {e.users?.length ?? 0}
                    </p>
                  </div>
                  <Link
                    href={`/${e.slug}/dashboard`}
                    className="rounded-full bg-brand-gray text-white text-xs font-semibold py-1.5 px-3 hover:bg-gray-700 transition-colors"
                  >
                    Open Dashboard
                  </Link>
                </div>

                {/* Handy deep links to wire later */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/providers?entity=${e.slug}`}
                    className="rounded-full bg-white border border-brand-muted/60 text-brand-gray text-xs py-1 px-3 hover:bg-brand-light/40 transition"
                  >
                    Providers
                  </Link>
                  <Link
                    href={`/tasks?entity=${e.slug}`}
                    className="rounded-full bg-white border border-brand-muted/60 text-brand-gray text-xs py-1 px-3 hover:bg-brand-light/40 transition"
                  >
                    Tasks
                  </Link>
                  <Link
                    href={`/alerts?entity=${e.slug}`}
                    className="rounded-full bg-white border border-brand-muted/60 text-brand-gray text-xs py-1 px-3 hover:bg-brand-light/40 transition"
                  >
                    Alerts
                  </Link>
                  <Link
                    href={`/payer-matrix?entity=${e.slug}`}
                    className="rounded-full bg-white border border-brand-muted/60 text-brand-gray text-xs py-1 px-3 hover:bg-brand-light/40 transition"
                  >
                    Payer Matrix
                  </Link>
                  <Link
                    href={`/settings?entity=${e.slug}`}
                    className="rounded-full bg-white border border-brand-muted/60 text-brand-gray text-xs py-1 px-3 hover:bg-brand-light/40 transition"
                  >
                    Settings
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
