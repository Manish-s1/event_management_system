
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IEvent } from "../types/types"

interface ITableProps {
    events: IEvent[]; 
    handleUpdateLocalState?: (event: IEvent, type: string) => void 
}

export function TableDemo({ events, handleUpdateLocalState }: ITableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Event Category</TableHead>
                    <TableHead>Event Organizer Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events?.map((event) => (
                    <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.id}</TableCell>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.category}</TableCell>
                        <TableCell>{event.organizer}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
