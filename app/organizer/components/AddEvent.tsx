

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LoaderCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Switch } from '@/components/ui/switch'
import axios from 'axios'
import { ICategory} from "../types/types"

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }).max(50, {
        message: "name must be less than 50 characters"
    }),
    isActive: z.boolean(),
    
})
 

interface IAddCategoryProps {
    handleUpdateLocalState?: (category: ICategory, type: string) => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
    showTrigger?: boolean
}
export function AddCategory({ handleUpdateLocalState, open, onOpenChange, showTrigger = true }: IAddCategoryProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dialogOpen = open ?? internalOpen
    const handleDialogOpenChange = onOpenChange ?? setInternalOpen

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            isActive: false
           
        },
    })

   
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoading(true)
        try {
            const payload = {
                name: data.name,
                isActive: data.isActive,
            }

            const response = await axios.post("/api/admin/category", payload)

            if (response.status === 201) {
                const createdCategory = response.data.data
                toast("Category Created Successfully")
                handleUpdateLocalState?.(createdCategory, "add")
                form.reset()
                handleDialogOpenChange(false)
            }
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? (typeof error.response?.data === "object" && error.response?.data !== null && "error" in error.response.data
                    ? String((error.response.data as Record<string, unknown>).error)
                    : error.message)
                : "Error Creating Category"
            toast(message)
        } finally {
            setLoading(false)
        }
    }

    



    return (
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
            <div className="max-h-screen ">
                {showTrigger && (
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline"
              className="bg-black text-white hover:bg-amber-100 border-b-4  border-t-4">Add New Category</Button>
                    </DialogTrigger>
                )}
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className=" text-2xl font-bold text-black">Add Category</DialogTitle>
                        <DialogDescription className="text-black">
                            Make changes to your Category here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center items-center  pt-4 ">
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full max-w-md bg-gray-900 p-6 rounded-2xl shadow-lg space-y-6 border border-gray-700">
          
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel  className="font-semibold text-lg text-gray-200 mb-2">Name</FormLabel>
                                        <FormControl>
                                            <Input  placeholder="shadcn" {...field} className='text-black border border-b-white bg-white w-full px-3 py-2 rounded-md' />
                                        </FormControl>
                                        <FormDescription className="text-gray-400 text-sm">
                                            This is your public display Category name.
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
                                            <FormLabel className="font-semibold text-lg text-gray-200">Is Active</FormLabel>
                                        </div >
                                        <FormControl className="flex items-center space-x-2">
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                             <Button type="submit" className='rounded px-4 py-2 hover:bg-zinc-400 bg-gray-900 text-white border-2 mb-4' >
            
          {
            loading ? 
            <>
            Submitting  <LoaderCircle className='animate-spin w-4 h-4'/>

            </>
            :
            <>
            Submit
            </>
          }        
            </Button>

                        </form>
                    </Form>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
