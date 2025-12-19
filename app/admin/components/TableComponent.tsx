
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IUser } from "../types/types"
import { EditUser } from "./EditUser"
import { DeleteUser } from "./DeleteUser"

interface ITableProps {
    users: IUser[];
    handleUpdateLocalState: (user: IUser, type: string) => void
}

export function TableDemo({ users, handleUpdateLocalState }: ITableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>email</TableHead>
                    <TableHead>role</TableHead>
                    <TableHead>isVerified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>


                </TableRow>
            </TableHeader>
            <TableBody>
                {users?.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell >{user.role}</TableCell>
                        <TableCell>{user.isVerified === false ? "false" : "true"}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end w-full gap-2">
                                <EditUser user={user} handleUpdateLocalState={handleUpdateLocalState} />
                                <DeleteUser userId={user.id} handleUpdateLocalState={handleUpdateLocalState} />
                            </div>
                        </TableCell>


                    </TableRow>
                ))}
            </TableBody>

        </Table>
    )
}
