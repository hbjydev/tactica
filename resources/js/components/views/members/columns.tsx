import { Badge } from '@/components/ui/badge';
import { show } from '@/wayfinder/routes/unit/members';
import { App } from '@/wayfinder/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { ReactNode } from 'react';

const STATUS_VARIANT: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    active: 'default',
    reserve: 'outline',
    discharged: 'destructive',
    loa: 'secondary',
};

export const memberColumns: ColumnDef<App.Models.UnitMember>[] = [
    {
        accessorKey: 'formal_name',
        header: 'Display Name',
        cell: ({ row, renderValue }) => {
            return (
                <Link
                    href={show({
                        // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                        unit: row.original.unit?.slug!,
                        member: row.original.id,
                    })}
                    className="underline hover:text-primary"
                >
                    {renderValue() as ReactNode}
                </Link>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant={STATUS_VARIANT[status] ?? 'outline'}
                    className="capitalize"
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorFn: ({ rank }) => rank?.display_name,
        header: 'Rank',
    },
    {
        accessorKey: 'created_at',
        header: 'Member Since',
        cell: ({ getValue }) =>
            moment(getValue<string>()).local().format('DD/MM/YYYY'),
    },
];
