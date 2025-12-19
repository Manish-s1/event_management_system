'use client'

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"

export function AddCategory({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name")
      return
    }
    
    try {
      setLoading(true)
      await axios.post("/api/admin/category", { name: name.trim() })
      toast.success("Category added successfully")
      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error("Error adding category:", error)
      toast.error(error.response?.data?.error || "Failed to add category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-semibold mb-4">Add Category</h2>

        <input
          className="border w-full p-2 mb-4"
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading || !name.trim()}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}
