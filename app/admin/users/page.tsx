

'use client'
import axios from "axios"
import { useEffect, useState } from "react"


import { IUser } from "../types/types"
import { AddUser } from "../components/AddUser"
import { TableDemo } from "../components/TableComponent"

export default function Adminpage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(false)

    const handleFetchUsers = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/api/admin/users")
            setUsers(response.data.data || [])
        } catch (error: any) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        handleFetchUsers()
    }, [])

    const handleUpdateLocalState = (user: IUser, type: string) => {
        if (type === "add") {
            setUsers(prev => [...prev, user])
        }
        if (type === "edit") {
            setUsers(prev => prev.map(u => u.id === user.id ? user : u))
        }
        if (type === "delete") {
            setUsers(prev => prev.filter((e) => e.id !== user.id))
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-2xl font-bold">All Users</div>
                <AddUser handleUpdateLocalState={handleUpdateLocalState} />
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-sm text-gray-500">Loading users...</div>
                ) : (
                    <TableDemo handleUpdateLocalState={handleUpdateLocalState} users={users} />
                )}
            </div>
        </div>
    )
}