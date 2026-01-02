'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar, LogOut, User, Ticket, Search } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [q, setQ] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const getProfileLink = () => {
    if (!session?.user) return '/user/profile'
    const role = (session.user as any).role
    if (role === 'ADMIN') return '/admin'
    if (role === 'ORGANIZER') return '/organizer/profile'
    return '/user/profile'
  }

  const getTicketsLink = () => {
    if (!session?.user) return '/user/tickets'
    const role = (session.user as any).role
    if (role === 'ORGANIZER') return '/organizer/events'
    return '/user/tickets'
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    router.push(query ? `/events?search=${encodeURIComponent(query)}` : '/events')
  }

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Calendar className="w-6 h-6" />
          <span className="text-xl font-bold">Eventify</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
         

          <Link href="/" className="text-sm font-medium hover:text-blue-400 transition-colors">
            Home
          </Link>
          
          <Link href="/events" className="text-sm font-medium hover:text-blue-400 transition-colors">
            Events
          </Link>

          <Link href="/categories" className="text-sm font-medium hover:text-blue-400 transition-colors">
            Categories
          </Link>
          
          {status === 'authenticated' ? (
            <>
              <Link 
                href={getProfileLink()}
                className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors"
              >
                <User className="w-4 h-4" />
                {(session?.user as any)?.role === 'ADMIN' ? 'Dashboard' : 'Profile'}
              </Link>
              
              {(session?.user as any)?.role !== 'ADMIN' && (
                <Link 
                  href={getTicketsLink()}
                  className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors"
                >
                  <Ticket className="w-4 h-4" />
                  {(session?.user as any)?.role === 'ORGANIZER' ? 'My Events' : 'My Tickets'}
                </Link>
              )}

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="text-sm font-medium hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
