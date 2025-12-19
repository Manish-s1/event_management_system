

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import axios from 'axios'
import { IUser } from "../types/types"

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }).max(15, {
        message: "name must be less than 15 characters"
    }),
    email: z.email().min(4, {
        message: "Email must be at least 4 characters.",
    }),
     password: z.string().min(4, {
    message: "Password must be at least 4 characters."
  }).max(50, { // changed from max 10 to max 50
    message: "Password must be at most 50 characters."
  }),
    role: z.enum(["ADMIN", "ORGANIZER", "USER"]),
    isVerified: z.boolean(),
    
})
 

interface IAddUserProps {
    handleUpdateLocalState: (user: IUser, type: string) => void
}
export function AddUser({ handleUpdateLocalState }: IAddUserProps) {
    const [open, setOpen] = useState(false) // Add state for dialog
      const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            isVerified: false,
            role: "USER",
             password: "",
           
        },
    })

   
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoading(true)
        try {
            const payload = {
                username: data.name,
                email: data.email,
                role: data.role,
                password: data.password,
                isVerified: data.isVerified,
            }

            const response = await axios.post("/api/admin/users", payload)

            if (response.status === 201) {
                const createdUser = response.data.data
                toast("User Created Successfully")
                handleUpdateLocalState(createdUser, "add")
                form.reset()
                setOpen(false)
            }
        } catch (error: any) {
            const message = error.response?.data?.error || "Error Creating User"
            toast(message)
        } finally {
            setLoading(false)
        }
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form className="max-h-screen ">
                <DialogTrigger asChild>
                    <Button variant="outline"
              className="bg-black text-white hover:bg-amber-100 border-b-4  border-t-4">Add New User</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className=" text-2xl font-bold text-black">Edit profile</DialogTitle>
                        <DialogDescription className="text-black">
                            Make changes to your profile here. Click save when you&apos;re
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
                                        <FormLabel className="font-semibold text-lg text-gray-200">Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example@gmail.com" {...field}   className='text-black border border-b-white bg-white w-full px-3 py-2 rounded-md'/>
                                        </FormControl>
                                        <FormDescription  className="text-gray-400 text-sm">
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
                                        <FormLabel className="font-semibold text-lg text-gray-200">Role</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full 'text-black border border-b-white bg-white  rounded-md">
                                                    <SelectValue placeholder="Select a role." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white ">
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
                                            <FormLabel className="font-semibold text-lg text-gray-200">Is Verified</FormLabel>

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
                             <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel  className="font-semibold text-lg text-gray-200">Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter  your password" {...field} className='text-black border border-b-white bg-white w-full px-3 py-2 rounded-md'/>
                                    </FormControl>
                                     <FormDescription className="text-gray-400 text-sm">
                  This is your password.
                </FormDescription>
                                    <FormMessage />
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
            </form>
        </Dialog>
    )
}
