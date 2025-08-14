'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 z-10 
                 px-4 py-2 rounded-lg text-sm font-semibold
                 bg-red-500 text-white hover:bg-red-600
                 transition-colors shadow-md"
    >
      Logout
    </button>
  )
}
