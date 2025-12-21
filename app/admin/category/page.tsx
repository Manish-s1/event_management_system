'use client'
import axios from "axios"
import { useEffect, useState } from "react"


import { ICategory } from "../types/types"
import { AddCategory } from "../components/AddCategory"
import { TableDemo } from "../components/CategoryTableComponent"

export default function Adminpage() {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [loading, setLoading] = useState(false)

    const handleFetchCategories = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/api/admin/category")
            setCategories(response.data.data || [])
        } catch (error: unknown) {
            console.error("Error fetching categories:", error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        handleFetchCategories()
    }, [])

    const handleUpdateLocalState = (category: ICategory, type: string) => {
        if (type === "add") {
            // Prepend so newest appears at top like server ordering
            setCategories(prev => [category, ...prev])
        }
        if (type === "edit") {
            setCategories(prev => prev.map(c => c.id === category.id ? category : c))
        }
        if (type === "delete") {
            setCategories(prev => prev.filter((e) => e.id !== category.id))
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-2xl font-bold">All Category</div>
                <AddCategory handleUpdateLocalState={handleUpdateLocalState} />
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-sm text-gray-500">Loading categories...</div>
                ) : (
                    <TableDemo handleUpdateLocalState={handleUpdateLocalState} categories={categories} />
                )}
            </div>
        </div>
    )
}