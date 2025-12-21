import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ICategory, IUser } from "../types/types"
import { EditCategory } from "./EditCategory"
import { DeleteCategory } from "./DeleteCategory"

interface ITableProps {
    categories: ICategory[];
    handleUpdateLocalState: (category: ICategory, type: string) => void
}

export function TableDemo({ categories, handleUpdateLocalState }: ITableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>isActive</TableHead>
                    <TableHead className="text-right">Actions</TableHead>


                </TableRow>
            </TableHeader>
            <TableBody>
                {categories?.map((category) => (
                    <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.id}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.isActive === false ? "false" : "true"}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end w-full gap-2">
                                <EditCategory category={category} handleUpdateLocalState={handleUpdateLocalState} />
                                <DeleteCategory categoryId={category.id} handleUpdateLocalState={handleUpdateLocalState} />
                            </div>
                        </TableCell>


                    </TableRow>
                ))}
            </TableBody>

        </Table>
    )
}
