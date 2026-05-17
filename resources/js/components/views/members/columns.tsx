import { show } from '@/routes/unit/members';
import { UnitMember } from '@/types/units';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { ReactNode } from 'react';

export const memberColumns: ColumnDef<UnitMember>[] = [
    {
        accessorKey: 'display_name',
        header: 'Display Name',
        cell: ({ row, renderValue }) => {
            return (
                <Link
                    href={show({ unit: row.original.unit?.slug!, member: row.original.id })}
                    className="underline hover:text-primary"
                >
                    {renderValue() as ReactNode}
                </Link>
            )
        },
    },
    {
        accessorFn: ({ rank }) => rank?.display_name,
        header: 'Rank',
    },
    {
        accessorKey: 'created_at',
        header: 'Member Since',
        cell: ({ getValue }) => moment(getValue<string>()).local().format('DD/MM/YYYY'),
    }
];
