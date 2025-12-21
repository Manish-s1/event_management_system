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
import { ICategory } from "../types/types"
import { Edit } from "lucide-react"

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }).max(50, {
        message: "name must be less than 50 characters"
    }),
    
    isActive: z.boolean()
})

interface IEditCategoryProps {
    category: ICategory
    handleUpdateLocalState: (category: ICategory, type: string) => void
}

export function EditCategory({ category, handleUpdateLocalState }: IEditCategoryProps) {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: category.name,
            isActive: category.isActive,
        },
    })

    // PUT: Complete replacement (sends all fields)
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        console.log(data)
        try {
            const response = await axios.put(`/api/admin/category/${category.id}`, data);
            if (response.status === 200) {
                toast.success("Category Updated Successfully")
                handleUpdateLocalState(response.data.data, "edit")
                setOpen(false)
            }
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? (typeof error.response?.data === "object" && error.response?.data !== null && "error" in error.response.data
                    ? String((error.response.data as Record<string, unknown>).error)
                    : error.message)
                : "Error Updating Category"
            toast.error(message)
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'icon'}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Make changes to your category here. Click save when you&apos;re done.
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
                                        This is your public display category name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Is Active</FormLabel>
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
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
