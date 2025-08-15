'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

const nav: { label: string; href: string; match: 'exact' | 'startsWith' }[] = [
  { label: 'List All Entities',        href: '/super/dashboard',          match: 'exact' },
  { label: 'Manage Entities', href: '/super/dashboard/entities',  match: 'startsWith' },
  { label: 'Manage Invites',         href: '/super/dashboard/invites',   match: 'startsWith' },
  { label: 'Manage Users',       href: '/super/dashboard/users',     match: 'startsWith' },
]

  const isActive = (href: string, match: 'exact' | 'startsWith') => {
    if (match === 'exact') return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-brand-gray text-white px-6 py-4 flex items-center justify-between">
        <div className="leading-tight">
          <h1 className="text-xl font-semibold">All Entities</h1>
          <p className="text-[11px] text-brand-muted">Super Admin</p>
        </div>
        <div className="text-sm font-bold tracking-widest text-brand-orange">INSUREEASE</div>
      </header>

      <div className="flex flex-1">
        <aside className="w-56 bg-brand-orange p-6 flex flex-col justify-between">
          <nav className="flex flex-col gap-3">
            {nav.map(({ label, href, match }) => {
              const active = isActive(href, match)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'block w-full rounded-full text-sm font-medium py-2 px-4 text-left transition',
                    active
                      ? 'bg-gray-900/10 text-black ring-1 ring-black/10'
                      : 'bg-white text-black hover:bg-gray-100',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8">
            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
