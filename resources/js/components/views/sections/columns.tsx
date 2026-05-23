import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { show } from '@/wayfinder/routes/unit/structure/sections';
import { App } from '@/wayfinder/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { ReactNode } from 'react';
import { SlotModal } from './slot-modal';

export const sectionColumns: ColumnDef<App.Models.Section>[] = [
    {
        accessorKey: 'display_name',
        header: 'Display Name',
        cell: ({ row, renderValue }) => {
            return (
                <Link
                    href={show({
                        // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                        unit: row.original.unit?.slug!,
                        section: row.original.id,
                    })}
                    className="underline hover:text-primary"
                >
                    {renderValue() as ReactNode}
                </Link>
            );
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            return (
                row.original.description || (
                    <span className="text-muted-foreground">&mdash;</span>
                )
            );
        },
    },
    {
        accessorKey: 'callsign',
        header: 'Callsign',
        cell: ({ row }) => {
            return (
                row.original.callsign || (
                    <span className="text-muted-foreground">&mdash;</span>
                )
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ getValue }) =>
            moment(getValue<string>()).local().format('DD/MM/YYYY'),
    },
];

export const slotColumns: ColumnDef<App.Models.Slot>[] = [
    {
        accessorKey: 'display_name',
        header: 'Display Name',
    },
    {
        accessorKey: 'callsign',
        header: 'Callsign',
        cell: ({ row }) => {
            return (
                row.original.callsign || (
                    <span className="text-muted-foreground">&mdash;</span>
                )
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ getValue }) =>
            moment(getValue<string>()).local().format('DD/MM/YYYY'),
    },

    {
        id: 'actions',
        cell: ({ row }) => {
            return (
                <SlotModal slot={row.original} />
            )
        },
    }
];
