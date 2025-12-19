import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useForm } from "react-hook-form"
import z from 'zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import axios from 'axios'
import { IUser } from "../types/types"
import { Edit } from "lucide-react"

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }).max(15, {
        message: "name must be less than 15 characters"
    }),
    email: z.string().email().min(4, {
        message: "Email must be at least 4 characters.",
    }),
    role: z.enum(["ADMIN", "ORGANIZER", "USER"] as const),
    isVerified: z.boolean()
})

interface IAddUserProps {
    user: IUser
    handleUpdateLocalState: (user: IUser, type: string) => void
}

export function EditUser({ user, handleUpdateLocalState }: IAddUserProps) {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            role: user.role
        },
    })

    // PUT: Complete replacement (sends all fields)
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        console.log(data)
        try {
            const response = await axios.put(`/api/admin/users/${user.id}`, data);
            if (response.status === 200) {
                toast.success("User Updated Successfully (PUT)")
                handleUpdateLocalState(response.data.data, "edit")
                setOpen(false)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Error Updating User")
            } else {
                toast.error("Error Updating User")
            }
        }
    }

    // PATCH removed — using PUT only per request

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'icon'}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <div className="w-full space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@gmail.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your email
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a role." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                                            <SelectItem value="ORGANIZER">ORGANIZER</SelectItem>
                                            <SelectItem value="USER">USER</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isVerified"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Is Verified</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                onClick={form.handleSubmit(onSubmit)}
                                variant="default"
                            >
                                Save (PUT)
                            </Button>
                        </div>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
