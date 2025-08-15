'use client'

import { useRouter } from 'next/navigation'

type Props = {
  variant?: 'sidebar' | 'floating' // optional
}

export default function LogoutButton({ variant = 'sidebar' }: Props) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  if (variant === 'floating') {
    // keep the old floating style if you ever want it
    return (
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-10 px-4 py-2 rounded-lg text-sm font-semibold
                   bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
      >
        Logout
      </button>
    )
  }

  // sidebar style (no fixed positioning)
  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 rounded-full text-sm font-semibold
                 bg-white text-red-600 hover:bg-red-50 border border-red-200
                 transition-colors"
    >
      Logout
    </button>
  )
}
