import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-brand-light/30 flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg ring-1 ring-brand-muted/40 p-8 text-center">
        <h1 className="text-2xl font-bold text-brand-gray mb-2">🚫 Access Denied</h1>
        <p className="text-brand-gray/90">
          You are not authorized to view this page.
        </p>
        <p className="text-brand-gray/80 mt-2">
          If you believe this is a mistake, please contact an administrator.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-orange px-5 py-2.5
                     text-sm font-semibold text-white hover:bg-orange-600 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          Return to Login
        </Link>
      </section>
    </main>
  )
}
