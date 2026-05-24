import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Paginated } from "@/types/units";
import { Button } from "./button";
import { router } from "@inertiajs/react";

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
} & ({
    data: TData[];
} | {
    data: Paginated<TData>;
});

function isPaginated<TData>(data: TData[] | Paginated<TData>): data is Paginated<TData> {
    return typeof data === 'object'
        && 'data' in data
        && 'total' in data;
}

export const DataTable = <TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) => {
    let innerData: TData[] = [];

    if (isPaginated(data)) {
        innerData = data.data;
    } else {
        innerData = data;
    }

    const table = useReactTable({
        data: innerData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: isPaginated(data),
        rowCount: isPaginated(data) ? data.total : undefined,
        state: {
            pagination: {
                pageIndex: isPaginated(data) ? data.current_page - 1 : 0,
                pageSize: isPaginated(data) ? data.per_page : 0,
            }
        },
    });

    return (
        <div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {isPaginated(data) && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            router.visit(data.prev_page_url as any as string);
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            router.visit(data.next_page_url as any as string);
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};
