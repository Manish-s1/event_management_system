import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { Trash } from "lucide-react"
import { toast } from "sonner";
import { ICategory } from "../types/types";
interface IDeleteCategoryProps {
    categoryId: string;
    handleUpdateLocalState: (category: ICategory, type: string) => void
}

export function DeleteCategory({ categoryId, handleUpdateLocalState }: IDeleteCategoryProps) {
    const handlDeleteCategory = async () => {
        try {
            const response = await axios.delete(`/api/admin/category/${categoryId}`)
            if (response.status === 200) {
                handleUpdateLocalState(response.data.data, "delete")
                toast("Category Deleted Successfully")
            }
        } catch (error: unknown) {
            console.error("Error deleting user:", error)
                        const message = axios.isAxiosError(error)
                            ? (typeof error.response?.data === "object" && error.response?.data !== null && "error" in error.response.data
                                    ? String((error.response.data as Record<string, unknown>).error)
                                    : error.message)
                            : "Error Deleting Category"
            toast(message)
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size={'icon'} variant={'destructive'}>
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        Category and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlDeleteCategory}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
