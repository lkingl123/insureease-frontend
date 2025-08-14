'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-brand-orange text-black flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md shadow-md px-8 py-6 rounded-3xl text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to InsureEase</h1>
        <p className="text-brand-gray mb-4">Credentialing simplified for healthcare teams.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-brand-gray text-white py-2 px-6 rounded-full hover:bg-gray-800 transition"
        >
          Login to Continue
        </button>
      </div>
    </div>
  )
}
