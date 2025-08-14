import { getUserFromToken } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function SuperAdminDashboard() {
  const user = await getUserFromToken()
  if (!user || user.role !== 'super_admin') {
    return (
      <main className="min-h-screen bg-brand-light/30 flex items-center justify-center">
        <p className="text-brand-gray text-base font-semibold">Unauthorized</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-light/30 pt-12">
      <LogoutButton />

      <section className="mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-brand-muted/40">
          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-brand-gray text-center mb-2">
              Super Admin Dashboard
            </h1>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-brand-gray">
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Role:</span> {user.role}</p>
            </div>

            <hr className="my-6 border-brand-muted/50" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/super/dashboard/entities"
                className="inline-flex items-center justify-center rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                Manage Entities
              </Link>

              <Link
                href="/super/dashboard/invites"
                className="inline-flex items-center justify-center rounded-lg bg-brand-gray px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                View Invites
              </Link>

              <Link
                href="/super/dashboard/users"
                className="inline-flex items-center justify-center rounded-lg border border-brand-muted/70 bg-white px-4 py-2.5 text-sm font-semibold text-brand-gray hover:bg-brand-light/40 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                All Users
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
