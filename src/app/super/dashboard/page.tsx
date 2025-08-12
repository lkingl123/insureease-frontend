import { getUserFromToken } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function SuperAdminDashboard() {
  const user = await getUserFromToken()
  if (!user || user.role !== 'super_admin') {
    return <p className="is-center">Unauthorized</p>
  }

  return (
    <main className="container" style={{ paddingTop: '3rem' }}>
      <LogoutButton />

      <section className="row is-center">
        <div className="card" style={{ width: '100%', maxWidth: '700px' }}>
          <div className="card-body">
            <h1 className="is-large is-center mb-2">Super Admin Dashboard</h1>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>

            <hr />

            <div className="row is-center mt-2">
              <div className="col">
                <Link href="/super/dashboard/entities">
                  <button className="button is-primary is-full-width">Manage Entities</button>
                </Link>
              </div>
              <div className="col">
                <Link href="/super/dashboard/invites">
                  <button className="button is-secondary is-full-width">View Invites</button>
                </Link>
              </div>
              <div className="col">
                <Link href="/super/dashboard/users">
                  <button className="button is-full-width">All Users</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
