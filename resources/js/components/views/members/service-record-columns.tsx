import { Badge } from '@/components/ui/badge';
import { show as showSection } from '@/wayfinder/routes/unit/structure/sections';
import { App } from '@/wayfinder/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';

type ServiceRecordType = App.Models.Enums.ServiceRecordEntryType;

const TYPE_LABELS: Record<ServiceRecordType, string> = {
    promotion: 'Promotion',
    demotion: 'Demotion',
    award: 'Award',
    disciplinary_action: 'Disciplinary Action',
    note: 'Note',
    assignment: 'Assignment',
};

const TYPE_VARIANT: Record<
    ServiceRecordType,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    promotion: 'default',
    demotion: 'destructive',
    award: 'secondary',
    disciplinary_action: 'destructive',
    note: 'outline',
    assignment: 'secondary',
};

type Props = {
    unit: App.Models.Unit;
    ranksLookup: Record<string, App.Models.Rank>;
    sectionsLookup: Record<string, App.Models.Section>;
};

export const createServiceRecordColumns = ({
    unit,
    ranksLookup,
    sectionsLookup,
}: Props): ColumnDef<App.Models.ServiceRecord>[] => [
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ getValue }) =>
            moment(getValue<string>()).local().format('DD/MM/YYYY HH:mm'),
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ getValue }) => {
            const type = getValue<ServiceRecordType>();
            return (
                <Badge variant={TYPE_VARIANT[type] ?? 'outline'}>
                    {TYPE_LABELS[type] ?? type}
                </Badge>
            );
        },
    },
    {
        id: 'details',
        header: 'Details',
        cell: ({ row }) => {
            const { type, data } = row.original;
            const recordData = data as Record<string, string | null>;

            if (type === 'promotion' || type === 'demotion') {
                const rank = recordData.rank_id
                    ? ranksLookup[recordData.rank_id]
                    : null;
                if (!rank)
                    return (
                        <span className="text-muted-foreground">&mdash;</span>
                    );
                const verb =
                    type === 'promotion' ? 'Promoted to' : 'Demoted to';
                return (
                    <span>
                        {verb}{' '}
                        <span className="font-medium">{rank.display_name}</span>
                    </span>
                );
            }

            if (type === 'assignment') {
                const sectionId = recordData.section_id;
                if (!sectionId) {
                    return <span>Unassigned</span>;
                }
                const section = sectionsLookup[sectionId];
                if (!section)
                    return (
                        <span className="text-muted-foreground">&mdash;</span>
                    );
                return (
                    <span>
                        Assigned to{' '}
                        <Link
                            href={
                                showSection({
                                    unit: unit.slug,
                                    section: section.id,
                                }).url
                            }
                            className="font-medium underline hover:text-primary"
                        >
                            {section.display_name}
                        </Link>
                    </span>
                );
            }

            return <span className="text-muted-foreground">&mdash;</span>;
        },
    },
    {
        id: 'performed_by',
        header: 'Performed By',
        cell: ({ row }) => {
            const performer = row.original.performed_by as
                | App.Models.UnitMember
                | null
                | undefined;
            if (!performer)
                return <span className="text-muted-foreground">System</span>;
            return (
                <span>
                    {(performer.formal_name as string | null) ??
                        performer.display_name}
                </span>
            );
        },
    },
];
