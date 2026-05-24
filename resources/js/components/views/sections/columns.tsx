import { show } from '@/wayfinder/routes/unit/structure/sections';
import { destroy } from '@/wayfinder/routes/unit/structure/sections/slot';
import { show as showMember } from '@/wayfinder/routes/unit/members';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { App } from '@/wayfinder/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { TrashIcon } from 'lucide-react';
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

export const slotColumns = (
    section: App.Models.Section,
): ColumnDef<App.Models.Slot>[] => [
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
        accessorKey: 'member',
        header: 'Member',
        cell: ({ row }) => {
            const unit = usePage().props.unit!;
            return row.original.member ? (
                <Link
                    href={showMember({
                        // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                        unit: unit.slug,
                        member: row.original.member.id,
                    })}
                    className="underline hover:text-primary"
                >
                    {row.original.member.formal_name as string}
                </Link>
            ) : (
                <span className="text-muted-foreground">&mdash;</span>
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
            const unit = usePage().props.unit!;
            return (
                <div className="flex items-center justify-end gap-x-2">
                    <SlotModal section={section} slot={row.original} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="icon" variant="destructive">
                                <TrashIcon />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete {row.original.display_name}?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete this slot and
                                    unassign any member currently assigned to
                                    it. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        router.delete(
                                            destroy.url({
                                                unit: unit.slug,
                                                section: section.id,
                                                slot: row.original.id,
                                            }),
                                        )
                                    }
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete slot
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            );
        },
    },
];
