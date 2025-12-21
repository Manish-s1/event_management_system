'use client'

import axios from "axios"
import { useEffect, useState } from "react"

import { IEvent } from "../types/types"
import { TableDemo } from "../components/EventTableComponents"

export default function Adminpage() {
  const [events, setEvents] = useState<IEvent[]>([])
  const [loading, setLoading] = useState(false)

  const handleFetchEvents = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/admin/events")
      setEvents(response.data.data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchEvents()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">All Events</div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading events...</div>
        ) : (
          <TableDemo events={events} />
        )}
      </div>
    </div>
  )
}
