export default function UnauthorizedPage() {
  return (
    <main className="container" style={{ paddingTop: '4rem' }}>
      <section className="row is-center">
        <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="card-body has-text-centered">
            <h1 className="is-large mb-2">🚫 Access Denied</h1>
            <p>You are not authorized to view this page.</p>
            <p className="mt-2">If you believe this is a mistake, please contact an administrator.</p>
            <a href="/login" className="button is-primary mt-3">Return to Login</a>
          </div>
        </div>
      </section>
    </main>
  )
}
