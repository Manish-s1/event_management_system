'use client'

import { signOut } from "next-auth/react"

export default function AdminNavbar() {
  return (
    <div className="h-14 bg-white shadow flex justify-end items-center px-6">
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}
