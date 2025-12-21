'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { AddCategory } from "../admin/components/AddCategory"

type Stats = {
  users: number
  organizers: number
  events: number
  categories: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    organizers: 0,
    events: 0,
    categories: 0
  })

  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get("/api/admin/dashboard")
      setStats(res.data)
    }
    fetchStats()
  }, [])

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
           Event Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Users" value={stats.users} />
        <StatCard title="Organizers" value={stats.organizers} />
        <StatCard title="Events" value={stats.events} />
        <StatCard title="Categories" value={stats.categories} />
      </div>

      {open && <AddCategory open={open} onOpenChange={setOpen} showTrigger={false} />}
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white shadow rounded p-6">
      <div className="text-gray-500">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  )
}
